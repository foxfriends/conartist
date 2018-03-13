//! The Product and Inventory tables
use std::panic::catch_unwind;
use postgres::rows::Row;

#[derive(Clone, Copy)]
pub struct InventoryItem {
    pub product_id: i32,
    pub quantity: i32,
}
impl InventoryItem {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                product_id: row.get("product_id"),
                quantity: row.get("quantity"),
            }
        }).map_err(|_| "Tried to create an InventoryItem from a non-Inventory row".to_string())
    }
}

#[derive(Clone)]
pub struct Product {
    pub product_id: i32,
    pub user_id: i32,
    pub type_id: i32,
    pub name: String,
    pub discontinued: bool,
}
impl Product {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                product_id: row.get("product_id"),
                type_id: row.get("type_id"),
                user_id: row.get("user_id"),
                name: row.get("name"),
                discontinued: row.get("discontinued"),
            }
        }).map_err(|_| "Tried to create a Product from a non-Product row".to_string())
    }

    pub fn in_inventory(self, inventory: InventoryItem) -> ProductInInventory {
        ProductInInventory {
            product: self,
            inventory
        }
    }
}

#[derive(Clone)]
pub struct ProductInInventory {
    pub product: Product,
    pub inventory: InventoryItem,
}
impl ProductInInventory {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                product: Product {
                    product_id: row.get("product_id"),
                    type_id: row.get("type_id"),
                    user_id: row.get("user_id"),
                    name: row.get("name"),
                    discontinued: row.get("discontinued"),
                },
                inventory: InventoryItem {
                    product_id: row.get("product_id"),
                    quantity: row.get("quantity"),
                }
            }
        }).map_err(|_| "Tried to create a ProductInInventory from a non-ProductInInventory row".to_string())
    }

    pub fn sold(self, amount: i32) -> Self {
        Self {
            product: self.product,
            inventory: InventoryItem {
                product_id: self.inventory.product_id,
                quantity: self.inventory.quantity - amount,
            },
        }
    }
}
