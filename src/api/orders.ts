import { supabase } from '../supabase'

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  status: 'pending' | 'fulfilled' | 'shipped' | 'cancelled';
  total_amount: number;
  created_at: string;
}

export interface OrderWine {
  id: string;
  order_id: string;
  wine_id: string;
  quantity: number;
}

export const createOrder = async (userId: string, wines: { id: string, quantity: number }[], totalAmount: number): Promise<Order | null> => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: userId, total_amount: totalAmount, status: 'pending' })
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    return null
  }

  const orderWines = wines.map(wine => ({
    order_id: order.id,
    wine_id: wine.id,
    quantity: wine.quantity
  }))

  const { error: orderWinesError } = await supabase
    .from('order_wines')
    .insert(orderWines)

  if (orderWinesError) {
    console.error('Error adding wines to order:', orderWinesError)
    // You might want to delete the created order here
    return null
  }

  return order
}

export const getOrderHistory = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_wines (
        quantity,
        wine_inventory (id, name, price)
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching order history:', error)
    return []
  }

  return data || []
}

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('Orders')
    .update({ status })
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error updating order status:', error)
    return null
  }

  return data
}