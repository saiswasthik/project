# class Orderservice:
#     def __init__(self):
#         pass

# class OrderService:
#     def __init__(self, db):
#         self.db = db

#     # ======================
#     # CUSTOMER SIDE
#     # ======================

#     async def checkout(self, customer_id: int):
#         """
#         CUSTOMER action:
#         - Reads customer's cart
#         - Creates master order
#         - Creates vendor orders
#         """
#         pass

#     async def get_customer_orders(self, customer_id: int):
#         pass

#     async def get_customer_order_details(
#         self,
#         customer_id: int,
#         order_id: int
#     ):
#         pass

#     async def cancel_order(
#         self,
#         customer_id: int,
#         vendor_order_id: int
#     ):
#         pass

#     # ======================
#     # VENDOR SIDE
#     # ======================

#     async def get_vendor_orders(self, vendor_id: int):
#         pass

#     async def get_vendor_order_details(
#         self,
#         vendor_id: int,
#         vendor_order_id: int
#     ):
#         pass

#     async def update_vendor_order_status(
#         self,
#         vendor_id: int,
#         vendor_order_id: int,
#         status: str
#     ):
#         pass

#     # ======================
#     # ADMIN SIDE
#     # ======================

#     async def get_all_orders(self):
#         pass

#     async def get_order_details(self, order_id: int):
#         pass
