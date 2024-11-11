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
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wine_id UUID REFERENCES public.Wine_Inventory(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 100),
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert some sample data into Wine_Inventory
INSERT INTO public.Wine_Inventory (name, varietal, region, vintage, price, stock)
VALUES
    ('Chateau Margaux', 'Cabernet Sauvignon', 'Bordeaux', 2015, 999.99, 50),
    ('Opus One', 'Cabernet Blend', 'Napa Valley', 2018, 399.99, 75),
    ('Dom Perignon', 'Chardonnay', 'Champagne', 2010, 249.99, 100);