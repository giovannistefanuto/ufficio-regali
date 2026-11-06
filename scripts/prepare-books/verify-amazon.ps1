$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$manifest = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'manifest.json') | ConvertFrom-Json
$reportPath = Join-Path $taskRoot 'docs/amazon-verification.json'
$results = @()
if (Test-Path -LiteralPath $reportPath) { $results = @(Get-Content -Raw -LiteralPath $reportPath | ConvertFrom-Json) }
foreach ($book in $manifest) {
  $isbn = $book.isbn13
  $existing = $results | Where-Object { $_.slug -eq $book.slug }
  if ($existing -and $existing.observed.isbnConfirmed -and $existing.expectedIsbn -eq $isbn) { continue }
  if ($isbn.StartsWith('978')) {
    $digits = $isbn.Substring(3, 9)
    $checksum = 0
    for ($i = 0; $i -lt 9; $i++) { $checksum += [int]::Parse($digits.Substring($i, 1)) * (10 - $i) }
    $check = (11 - ($checksum % 11)) % 11
    $asin = $digits + $(if ($check -eq 10) { 'X' } else { [string]$check })
  } elseif ($book.slug -eq 'atomic-habits') {
    # ASIN from De Agostini's /acquista/9791221208870/cartaceo/amazon redirect.
    $asin = 'B0C7FQW26M'
  } else { continue }
  $candidate = "https://www.amazon.it/dp/$asin"
  & npx --yes agent-browser --session ufficio-00e67a5b898d open $candidate
  $expression = "({url:location.href,title:document.querySelector('#productTitle')?.textContent.trim(),isbnConfirmed:Array.from(document.querySelectorAll('#detailBullets_feature_div,#productDetails_detailBullets_sections1,#rpi-attribute-book_details-isbn13')).map(e=>e.textContent).join('').replace(/\D/g,'').includes('$isbn')})"
  $raw = & npx --yes agent-browser --session ufficio-00e67a5b898d --json eval $expression
  $parsed = $raw | ConvertFrom-Json
  $result = [ordered]@{ slug = $book.slug; expectedIsbn = $isbn; candidate = $candidate; observed = $parsed.data.result; checkedOn = '2026-11-04' }
  $results = @($results | Where-Object { $_.slug -ne $book.slug }) + @($result)
  $results | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $taskRoot 'docs/amazon-verification.json') -Encoding utf8
  $result | ConvertTo-Json -Depth 5 -Compress | Write-Output
}
