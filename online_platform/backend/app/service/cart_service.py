class Cartservice:
    def __init__(self):
        pass

    async def add_to_cart(self,customer_id:int,product_id:int,quantity:int):
        pass
    
    async def get_cart(self,customer_id:int):
        pass

    async def update_cart(self,customer_id:int,product_id:int,quantity:int,cart_item_it:int):
        pass

    async def delete_cart_item(self,customer_id:int,product_id:int,cart_item_id:int):
        pass

