# Laegger MiniMig (version 2, 3D) paa minimig.dk/bygogspil/.
# Kopierer den senest committede udgave af 3d-forsoeg/ fra app-projektet, saa halvfaerdigt arbejde ikke kommer med -
# kun det, spillet bruger: siden, three.js, figuren, toej, haar, bevaegelser, ikoner og baggrunde. figur.fbx er for
# stor til git og tages fra mappen. Bagefter laver build-pwa.ps1 offline-listen og saetter Til voksne paa siden.
# Koer: hoejreklik paa filen -> Koer med PowerShell. Bagefter: GitHub Desktop -> Commit -> Push origin.
# (Afloeser opdater-proev.ps1 fra 03-11-2026: /proev sender nu videre hertil, version 1 ligger skjult i /version1.)
param([string]$App = "$env:USERPROFILE\Documents\Mini-Mig")
$ErrorActionPreference = 'Stop'

# git foelger med GitHub Desktop, ogsaa naar det ikke ligger i PATH
$git = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $git) {
  $git = Get-ChildItem "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe" |
    Sort-Object { [version]($_.FullName -replace '.*\\app-([\d.]+)\\.*', '$1') } -Descending |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $git) { throw 'Fandt ikke git. Installer GitHub Desktop.' }

$maal = Join-Path $PSScriptRoot 'bygogspil'
$tmp = Join-Path $env:TEMP "minimig-bygogspil-$PID"
New-Item -ItemType Directory $tmp | Out-Null
try {
  & $git -C $App archive --format=zip -o "$tmp\v2.zip" HEAD 3d-forsoeg
  if ($LASTEXITCODE) { throw 'git archive fejlede.' }
  Expand-Archive "$tmp\v2.zip" -DestinationPath $tmp
  $kilde = Join-Path $tmp '3d-forsoeg'
  # (kun spillets egne filer - ikke scripts, noter, referencebilleder eller gamle figurer)
  $filer = Get-ChildItem $kilde -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($kilde.Length + 1).Replace('\', '/')
    $rel -match '^(index\.html|manifest\.webmanifest|three/.*|ikoner/.*|baggrund/.*|[a-z0-9-]+\.(fbx|glb|json|jpg|png))$' -and $rel -notmatch '^(reference|gammel-figur|mixamo-nye|tests)/'
  }
  if (-not ($filer | Where-Object Name -eq 'index.html')) { throw 'Fandt ikke index.html i 3d-forsoeg.' }
  if (Test-Path $maal) { Remove-Item $maal -Recurse -Force }
  foreach ($f in $filer) {
    $rel = $f.FullName.Substring($kilde.Length + 1)
    $ud = Join-Path $maal $rel
    New-Item -ItemType Directory -Force (Split-Path $ud) | Out-Null
    Copy-Item $f.FullName $ud
  }
  Copy-Item (Join-Path $App '3d-forsoeg\figur.fbx') (Join-Path $maal 'figur.fbx')

  & (Join-Path $PSScriptRoot 'build-pwa.ps1')

  $version = & $git -C $App log -1 --format='%h %s'
  Write-Host "bygogspil/ opdateret fra app-projektet: $version ($($filer.Count + 1) filer)"
} finally {
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
