import mysql.connector
from config import DB_CONFIG
class SupplierModel:
    def __init__(self):
        self.db_config=DB_CONFIG
        
    def get_connection(self):
        return mysql.connector.connect(**self.db_config)
    
    def insert_supplier(self,name,  phone, address,description=None):
        conn = self.get_connection()
        cursor = conn.cursor()
        sql="""
            INSERT INTO Supplier (name, phone, address, description)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql,(name, phone, address,description))
        conn.commit()
        supplier_id=cursor.lastrowid
        cursor.close()
        conn.close()
        return supplier_id
    def select_all_suppliers(self):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        sql="SELECT * FROM Supplier"
        cursor.execute(sql)
        suppliers=cursor.fetchall()
        cursor.close()
        conn.close()
        return suppliers
    def get_supplier_by_id(self,supplier_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        sql="SELECT * FROM Supplier WHERE id=%s"
        cursor.execute(sql,(supplier_id,))
        supplier=cursor.fetchone()
        cursor.close()
        conn.close()
        return supplier
    def update_supplier(self,supplier_id, **kwargs):
        conn = self.get_connection()
        cursor = conn.cursor()
        fields = []
        values = []
        for key, value in kwargs.items():
            fields.append(f"{key}=%s")
            values.append(value)
        values.append(supplier_id)
        sql=f"UPDATE Supplier SET {', '.join(fields)} WHERE id=%s"
        cursor.execute(sql, tuple(values))
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        conn.close()
        return affected_rows > 0
    def delete_supplier(self,supplier_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        sql="DELETE FROM Supplier WHERE id=%s"
        cursor.execute(sql,(supplier_id,))
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        conn.close()
        return affected_rows > 0
    