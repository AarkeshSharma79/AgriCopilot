# Crop Disease Dataset

This folder is a placeholder for a labeled leaf-image dataset used to train
`models/crop_disease_model/model.h5`. No dataset is included in this
repository.

## Expected structure

```
crop-disease/
├── train/
│   ├── <class_name_1>/
│   │   ├── image001.jpg
│   │   └── ...
│   ├── <class_name_2>/
│   └── ...
└── val/
    ├── <class_name_1>/
    └── ...
```

Each `<class_name>` subfolder should contain images belonging to that
disease class (or "healthy"). This layout is directly compatible with
`tf.keras.utils.image_dataset_from_directory`.

## Suggested public sources

- PlantVillage dataset (leaf images across multiple crops and disease classes).
- Any institution-collected, properly licensed field-image dataset.

## Notes

- Until real data is placed here and a model is trained, the disease
  prediction endpoint (`/predict-disease`) uses the heuristic fallback
  defined in `models/crop_disease_model/model.py`, which is explicitly
  **not** a disease classifier.
- After training, save the labels (one class name per line, in the order
  used during training) to `models/crop_disease_model/labels.txt`.
