if [ $# -ne 1 ]; then
    echo "Usage: sh $0 <placeName>" >&2
    exit 1
fi

PLACE_NAME=$1
PROJECT_JSON_FILE="places/$PLACE_NAME/$PLACE_NAME.project.json"

if [ ! -d "./places/$PLACE_NAME" ]; then
    echo "Error: Place '$PLACE_NAME' not found in project." >&2
    exit 1
fi

if [ ! -f "$PROJECT_JSON_FILE" ]; then
    echo "Error: Place '$PLACE_NAME' is missing its project.json file." >&2
    exit 1
fi

rojo serve "./$PROJECT_JSON_FILE"