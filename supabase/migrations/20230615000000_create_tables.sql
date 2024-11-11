-- Create Users table
CREATE TABLE IF NOT EXISTS public.Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    wine_tier INTEGER CHECK (wine_tier >= 1 AND wine_tier <= 5),
    first_name TEXT,
    last_name TEXT,
    preferences JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Wine_Inventory table
CREATE TABLE IF NOT EXISTS public.Wine_Inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    varietal TEXT NOT NULL,
    region TEXT NOT NULL,
    vintage INTEGER CHECK (vintage >= 1900 AND vintage <= EXTRACT(YEAR FROM CURRENT_DATE)),
    price NUMERIC NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Wine_Ratings_Reviews table
CREATE TABLE IF NOT EXISTS public.Wine_Ratings_Reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.Users(id) ON DELETE CASCADE,
    wine_id UUID REFERENCES public.Wine_Inventory(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 100),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS public.Orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.Users(id) ON DELETE CASCADE,
    order_date TIMESTAMPTZ DEFAULT now(),
    status TEXT CHECK (status IN ('pending', 'fulfilled', 'shipped', 'cancelled')),
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Order_Wines table
CREATE TABLE IF NOT EXISTS public.Order_Wines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.Orders(id) ON DELETE CASCADE,
    wine_id UUID REFERENCES public.Wine_Inventory(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Create Invoices_Transactions table
CREATE TABLE IF NOT EXISTS public.Invoices_Transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.Orders(id) ON DELETE CASCADE,
    invoice_pdf TEXT,
    payment_status TEXT CHECK (payment_status IN ('paid', 'pending', 'failed')),
    transaction_date TIMESTAMPTZ DEFAULT now(),
    payment_method TEXT CHECK (payment_method IN ('credit card', 'paypal', 'bank transfer')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Events table
CREATE TABLE IF NOT EXISTS public.Events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    description TEXT,
    date TIMESTAMPTZ NOT NULL,
    venue TEXT,
    attendees JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);