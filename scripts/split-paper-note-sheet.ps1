param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Destination
)

Add-Type -AssemblyName System.Drawing

$sourceBitmap = [System.Drawing.Bitmap]::FromFile((Resolve-Path -LiteralPath $Source))
$cells = @(
  @{ Name = '01-torn-notebook-note.png'; X = 0; Y = 0; W = 506; H = 506 },
  @{ Name = '02-blue-grid-note.png'; X = 517; Y = 0; W = 501; H = 506 },
  @{ Name = '03-sage-deckled-note.png'; X = 1029; Y = 0; W = 507; H = 506 },
  @{ Name = '04-rose-ruled-note.png'; X = 0; Y = 519; W = 506; H = 505 },
  @{ Name = '05-gold-scalloped-note.png'; X = 517; Y = 519; W = 501; H = 505 },
  @{ Name = '06-lavender-folded-note.png'; X = 1029; Y = 519; W = 507; H = 505 }
)

New-Item -ItemType Directory -Force -Path $Destination | Out-Null

foreach ($cell in $cells) {
  $crop = New-Object System.Drawing.Bitmap($cell.W, $cell.H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($crop)
  $graphics.DrawImage(
    $sourceBitmap,
    (New-Object System.Drawing.Rectangle(0, 0, $cell.W, $cell.H)),
    (New-Object System.Drawing.Rectangle($cell.X, $cell.Y, $cell.W, $cell.H)),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $graphics.Dispose()

  $minX = $crop.Width
  $minY = $crop.Height
  $maxX = -1
  $maxY = -1

  for ($y = 0; $y -lt $crop.Height; $y++) {
    for ($x = 0; $x -lt $crop.Width; $x++) {
      $pixel = $crop.GetPixel($x, $y)
      # Remove the solid key colour plus the antialiased magenta fringe. The
      # dual red/blue dominance test preserves the rose and lavender papers.
      $isChroma = $pixel.R -gt 205 -and $pixel.B -gt 145 -and $pixel.G -lt 175 -and ($pixel.R - $pixel.G) -gt 50 -and ($pixel.B - $pixel.G) -gt 30
      if ($isChroma) {
        $crop.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      } else {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  $padding = 24
  $left = [Math]::Max(0, $minX - $padding)
  $top = [Math]::Max(0, $minY - $padding)
  $right = [Math]::Min($crop.Width - 1, $maxX + $padding)
  $bottom = [Math]::Min($crop.Height - 1, $maxY + $padding)
  $width = $right - $left + 1
  $height = $bottom - $top + 1

  $output = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $outputGraphics = [System.Drawing.Graphics]::FromImage($output)
  $outputGraphics.DrawImage(
    $crop,
    (New-Object System.Drawing.Rectangle(0, 0, $width, $height)),
    (New-Object System.Drawing.Rectangle($left, $top, $width, $height)),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $outputGraphics.Dispose()
  $output.Save((Join-Path $Destination $cell.Name), [System.Drawing.Imaging.ImageFormat]::Png)
  $output.Dispose()
  $crop.Dispose()
}

$sourceBitmap.Dispose()
