import customtkinter as ctk
from PIL import Image # Import Image from Pillow

# --- Global variables ---
map_image_label = None
# For debouncing the resize event
resize_job_id = None
last_image_dims = (0, 0) # Store the last dimensions the image was rendered at

def get_image_display_size():
    """Calculates the available space for the image within the window."""
    root.update_idletasks() # Ensure geometry is up-to-date
    window_width = root.winfo_width()
    window_height = root.winfo_height()

    print(f"DEBUG: Window size: {window_width}x{window_height}")

    # Check if selection widgets are still visible
    if boss_label.winfo_viewable():
        # Header widgets are visible - calculate space for them
        header_height = 0
        for row in range(5):  # rows 0-4 contain header elements
            root.grid_rowconfigure(row, weight=0)
            # Add estimated height for each row (label + combobox + padding)
            if row in [0, 2]:  # Label rows
                header_height += 35  # Label height + padding
            elif row in [1, 3]:  # Combobox rows  
                header_height += 40  # Combobox height + padding
            elif row == 4:  # Button row
                header_height += 50  # Button height + padding

        available_height = max(window_height - header_height - 20, 50)  # Extra padding + minimum
        print(f"DEBUG: Header visible, header_height: {header_height}")
    else:
        # Selection widgets are hidden - use almost full window height
        # Account for padding and any potential window decorations/borders
        padding = 20  # Conservative padding
        available_height = max(window_height - padding, 50)  # Just some padding + minimum
        print(f"DEBUG: Header hidden, using full window minus padding")
    
    # Account for side padding
    side_padding = 20  # Conservative side padding
    available_width = max(window_width - side_padding, 50)  # Side padding + minimum

    print(f"DEBUG: Available space calculated: {available_width}x{available_height}")
    return available_width, available_height

def display_map(shifting_earth_name):
    global map_image_label, last_image_dims

    map_path = f"Maps/{shifting_earth_name}.png"

    try:
        current_max_width, current_max_height = get_image_display_size()

        # Optimization: Only re-render if display size has changed significantly
        size_threshold = 10  # Only re-render if size changes by more than 10 pixels
        if (map_image_label and 
            abs(last_image_dims[0] - current_max_width) < size_threshold and 
            abs(last_image_dims[1] - current_max_height) < size_threshold):
            return

        pil_image = Image.open(map_path)
        original_width, original_height = pil_image.size

        print(f"DEBUG: Original image: {original_width}x{original_height}")
        print(f"DEBUG: Available space: {current_max_width}x{current_max_height}")

        # Calculate scale factors for both dimensions
        ratio_width = current_max_width / original_width
        ratio_height = current_max_height / original_height

        print(f"DEBUG: Width ratio: {ratio_width:.3f}, Height ratio: {ratio_height:.3f}")

        # Use the smaller ratio to ensure the entire image fits (no cropping)
        scale_factor = min(ratio_width, ratio_height)
        print(f"DEBUG: Using scale factor: {scale_factor:.3f}")

        # Calculate new dimensions
        new_width = int(original_width * scale_factor)
        new_height = int(original_height * scale_factor)

        print(f"DEBUG: Calculated new size: {new_width}x{new_height}")

        # Ensure minimal dimensions to avoid errors
        new_width = max(new_width, 10)
        new_height = max(new_height, 10)

        # Double-check that scaled image fits within available space
        if new_width > current_max_width or new_height > current_max_height:
            print(f"WARNING: Scaled image ({new_width}x{new_height}) exceeds available space ({current_max_width}x{current_max_height})")
            # Recalculate with a safety margin
            safety_margin = 0.95  # Use 95% of available space
            ratio_width = (current_max_width * safety_margin) / original_width
            ratio_height = (current_max_height * safety_margin) / original_height
            scale_factor = min(ratio_width, ratio_height)
            new_width = int(original_width * scale_factor)
            new_height = int(original_height * scale_factor)
            print(f"DEBUG: Adjusted to: {new_width}x{new_height} with safety margin")

        # High-quality resize
        resized_pil_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Create CTkImage - NOTE: The size parameter should match the actual resized image
        ctk_image = ctk.CTkImage(
            light_image=resized_pil_image, 
            dark_image=resized_pil_image,
            size=(new_width, new_height)
        )

        # Create or update the image label
        if map_image_label is None:
            map_image_label = ctk.CTkLabel(root, text="", image=ctk_image)
            map_image_label.grid(row=5, column=0, pady=10, sticky="nsew")
        else:
            map_image_label.configure(image=ctk_image, text="")
            
        # Keep reference to prevent garbage collection
        map_image_label.image = ctk_image 
        last_image_dims = (current_max_width, current_max_height)

        # Additional debug: Check the actual label size after display
        root.update_idletasks()
        label_width = map_image_label.winfo_width()
        label_height = map_image_label.winfo_height()
        print(f"DEBUG: Label actual size: {label_width}x{label_height}")
        print(f"DEBUG: Image fits in label: width={new_width <= label_width}, height={new_height <= label_height}")
        print(f"DEBUG: Final image displayed at {new_width}x{new_height}")
        print("="*50)

    except FileNotFoundError:
        print(f"Error: Map file not found at {map_path}")
        error_text = "Map not found!"
        if map_image_label:
            map_image_label.configure(image=None, text=error_text)
            map_image_label.image = None
        else:
            map_image_label = ctk.CTkLabel(root, text=error_text, font=medieval_font_large)
            map_image_label.grid(row=5, column=0, pady=10, sticky="nsew")
        last_image_dims = (0, 0)
        
    except Exception as e:
        print(f"An error occurred loading map: {e}")
        error_text = "Error loading map!"
        if map_image_label:
            map_image_label.configure(image=None, text=error_text)
            map_image_label.image = None
        else:
            map_image_label = ctk.CTkLabel(root, text=error_text, font=medieval_font_large)
            map_image_label.grid(row=5, column=0, pady=10, sticky="nsew")
        last_image_dims = (0, 0)

def submit_selections():
    boss = boss_combobox.get()
    shifting_earth = shifting_earth_combobox.get()
    print(f"Boss Selected: {boss}")
    print(f"Shifting Earth Selected: {shifting_earth}")
    
    # Hide all the selection widgets
    boss_label.grid_remove()
    boss_combobox.grid_remove()
    shifting_earth_label.grid_remove()
    shifting_earth_combobox.grid_remove()
    submit_button.grid_remove()
    
    # Reconfigure the grid so the map takes up the full window
    root.grid_rowconfigure(5, weight=1)  # Map row gets all the space
    
    display_map(shifting_earth)

# Debounced resize handler
def handle_resize_debounced(event):
    global resize_job_id
    # Only handle resize events from the main window, not child widgets
    if event.widget == root:
        # Cancel any previously scheduled resize jobs
        if resize_job_id:
            root.after_cancel(resize_job_id)
        # Schedule display_map to run after 150ms (slightly longer delay for smoother performance)
        resize_job_id = root.after(150, lambda: display_map(shifting_earth_combobox.get()))

# --- Setup CustomTkinter Theme ---
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("green")

root = ctk.CTk()
root.title("Feudal Selections & Map")
root.geometry("600x600")
root.resizable(True, True)

# Configure grid rows and columns
root.grid_rowconfigure(0, weight=0) # Boss label
root.grid_rowconfigure(1, weight=0) # Boss combobox
root.grid_rowconfigure(2, weight=0) # Shifting Earth label
root.grid_rowconfigure(3, weight=0) # Shifting Earth combobox
root.grid_rowconfigure(4, weight=0) # Submit button
root.grid_rowconfigure(5, weight=1) # Map display (this row expands)
root.grid_columnconfigure(0, weight=1) # Center content horizontally

# --- Define the Font using Almendra ---
medieval_font_large = ctk.CTkFont(family="Almendra", size=16)
medieval_font_medium = ctk.CTkFont(family="Almendra", size=14)

# --- Boss Selection ---
boss_label = ctk.CTkLabel(root, text="Choose Your Foe:", font=medieval_font_large)
boss_label.grid(row=0, column=0, pady=5)

boss_options = ["Gladius", "Adel", "Gnoster", "Maris", "Libra", "Fulghor", "Caligo", "Heolstor"]
boss_combobox = ctk.CTkComboBox(root, values=boss_options, state="readonly", width=200, font=medieval_font_medium)
boss_combobox.set("Gladius")
boss_combobox.grid(row=1, column=0, pady=5)

# --- Shifting Earth Selection ---
shifting_earth_label = ctk.CTkLabel(root, text="The Shifting Earth:", font=medieval_font_large)
shifting_earth_label.grid(row=2, column=0, pady=5)

shifting_earth_options = ["None", "Mountains", "Crater", "Rotted Woods", "Noklateo"]
shifting_earth_combobox = ctk.CTkComboBox(root, values=shifting_earth_options, state="readonly", width=200, font=medieval_font_medium)
shifting_earth_combobox.set("None")
shifting_earth_combobox.grid(row=3, column=0, pady=5)

# --- Submit Button ---
submit_button = ctk.CTkButton(root, text="Confirm Fate", command=submit_selections, font=medieval_font_medium, width=150)
submit_button.grid(row=4, column=0, pady=10)

# Bind the configure event to the debounced handler
root.bind("<Configure>", handle_resize_debounced)

# Run the application
root.mainloop()