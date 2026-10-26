# Lægger browserudgaven af MiniMig på minimig.dk/proev/.
# Kopierer den senest committede udgave af www/ fra app-projektet, så halvfærdigt arbejde ikke kommer med.
# Kør: højreklik på filen → Kør med PowerShell (Run with PowerShell).
# Bagefter: GitHub Desktop → Commit → Push origin.
# Kun ASCII i det, scriptet skriver ind i siden: Windows PowerShell læser denne fil som ANSI.
param([string]$App = "$env:USERPROFILE\Documents\Mini-Mig")
$ErrorActionPreference = 'Stop'

# git følger med GitHub Desktop, også når det ikke ligger i PATH
$git = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $git) {
  $git = Get-ChildItem "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe" |
    Sort-Object { [version]($_.FullName -replace '.*\\app-([\d.]+)\\.*', '$1') } -Descending |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $git) { throw 'Fandt ikke git. Installer GitHub Desktop.' }

$maal = Join-Path $PSScriptRoot 'proev'
$tmp = Join-Path $env:TEMP "minimig-proev-$PID"
New-Item -ItemType Directory $tmp | Out-Null
try {
  & $git -C $App archive --format=zip -o "$tmp\www.zip" HEAD www
  if ($LASTEXITCODE) { throw 'git archive fejlede.' }
  Expand-Archive "$tmp\www.zip" -DestinationPath $tmp
  if (Test-Path $maal) { Remove-Item $maal -Recurse -Force }
  Move-Item "$tmp\www" $maal

  # Spillet har ingen titel; giv det en, og bed søgemaskiner lade siden være
  $fil = Join-Path $maal 'index.html'
  $html = [IO.File]::ReadAllText($fil)
  $html = $html.Replace('<meta charset="utf-8">', "<meta charset=`"utf-8`">`n<title>Pr&oslash;v MiniMig</title>`n<meta name=`"robots`" content=`"noindex`">`n<link rel=`"icon`" href=`"../billeder/ikon-180.png`">`n<link rel=`"apple-touch-icon`" href=`"../billeder/ikon-180.png`">")
  [IO.File]::WriteAllText($fil, $html, (New-Object Text.UTF8Encoding $false))

  & (Join-Path $PSScriptRoot 'build-pwa.ps1')

  $version = & $git -C $App log -1 --format='%h %s'
  Write-Host "proev/ opdateret fra app-projektet: $version"
} finally {
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
