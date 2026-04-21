if [ $# -ne 2 ]; then
    echo "Usage: sh $0 <PlaceName> <RojoPort>" >&2
    exit 1
fi

TEPLATE_NAME_PLACEHOLDER="PLACE_NAME"
TEMPLATE_DIR="places/$TEPLATE_NAME_PLACEHOLDER"
ROJO_PORT_PLACEHOLDER="-9999"

PLACE_NAME=$1
ROJO_PORT=$2

if [ -d "places/$PLACE_NAME" ]; then
    echo "Error: A place named '$PLACE_NAME' already exists." >&2
    exit 1
fi

if ! [[ $ROJO_PORT =~ ^[0-9]+$ ]]; then
    echo "Error: RojoPort must be a valid number. (given: $ROJO_PORT)" >&2
    exit 1
fi

# -----------------------------
# Function to create a place template
# -----------------------------
main() {
    replicateHierarchy $TEMPLATE_DIR
}

# -----------------------------
# Function to recursively replicate a hierarchy of directories and files from the template
# Parameter : source 
# -----------------------------
replicateHierarchy() {
    local source=$1

    if [ -d "$source" ]; then
        # Create the corresponding directory
        local path=${source//$TEPLATE_NAME_PLACEHOLDER/$PLACE_NAME}
        mkdir -p "$path"

        for child in "$source"/*; do
            [ -e "$child" ] || continue 
            replicateHierarchy "$child"
        done
    else
        # Replicate the file with content replacement
        replicateFile "$source"
    fi
}

# -----------------------------
# Function to replicate a single file from the template
# Parameter : source
# -----------------------------
replicateFile() {
    local source=$1
    local content=$(cat "$source")
    local modifiedContent=${content//$TEPLATE_NAME_PLACEHOLDER/$PLACE_NAME}
    modifiedContent=${modifiedContent//$ROJO_PORT_PLACEHOLDER/$ROJO_PORT}
    local path=${source//$TEPLATE_NAME_PLACEHOLDER/$PLACE_NAME}
    echo "$modifiedContent" > "$path"
}

main