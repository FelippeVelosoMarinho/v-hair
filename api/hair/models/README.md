# Models Directory

Este diretório contém os modelos treinados para classificação de cabelo.

## Arquivo necessário

Copie o arquivo `best.pt` do treinamento YOLO para este diretório:

```bash
# Windows (PowerShell)
Copy-Item "..\..\..\..\YOLO\runs\detect\train\weights\best.pt" -Destination "."

# Ou manualmente copie de:
# YOLO/runs/detect/train/weights/best.pt
```

## Modelo atual

- **best.pt** - Modelo YOLOv8 treinado para classificação de curvatura capilar
  - Classes: 1, 2A, 2B, 2C, 3A, 3B, 3C, 4A, 4B, 4C (10 classes)
  - Input size: 640x640
  - Treinamento: 50 epochs
