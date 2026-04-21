if [ $# -ne 1 ]; then
  echo "Usage: sh $0 <placeName>" >&2
  exit 1
fi

PLACE_NAME=$1

if [ ! -d "./places/$PLACE_NAME" ]; then
    echo "Error: Place '$PLACE_NAME' not found in project." >&2
    exit 1
fi

rbxtsc -w -p "./places/$PLACE_NAME"