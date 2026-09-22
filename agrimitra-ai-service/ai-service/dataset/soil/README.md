# Soil Dataset

Placeholder for soil data used to train a proper soil-analysis model
(moisture, fertility, pH, nutrient levels), replacing the current
color-heuristic fallback in `prediction/crop_prediction.py`.

## Expected schema (soil.csv)

| column           | type   | description                                  |
|------------------|--------|-----------------------------------------------|
| farm_id          | string | Identifier joining to the weather dataset     |
| image_path       | string | Path to the corresponding soil photograph     |
| ph               | float  | Lab-measured soil pH                          |
| nitrogen         | string | low / medium / high                           |
| phosphorus       | string | low / medium / high                           |
| potassium        | string | low / medium / high                           |
| moisture_percent | float  | Lab- or sensor-measured moisture percentage   |
| soil_type        | string | alluvial / black / red / laterite / arid / mountain |

Use `preprocessing/data_preprocessing.py`'s `clean_soil_data()` function to
validate and clean this file before training.

## Notes

No soil dataset is bundled with this repository. Populate this folder with
real, properly licensed data (e.g., paired soil-test-lab results and field
photographs) before attempting to train a soil-analysis model.
