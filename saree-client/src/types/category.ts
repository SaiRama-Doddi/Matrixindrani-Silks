export interface Category {
  id: string;            // Unique identifier for each category
  name: string;          // Category name, e.g. "Silk", "Cotton", "Banarasi"
  description?: string;  // Optional: short description of the category
  image?: string;        // Optional: category display image
  createdAt: string;     // When the category was created
  createdBy?: string;    // Admin user who created it
}
