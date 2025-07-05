# Input data (paste the list between the triple quotes)
data = """
Italian Amarone
South African Chenin Blanc
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Central Italy White
Bordeaux Libournais Red
German Riesling
French Champagne
Burgundy Chablis
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Californian Sonoma Coast Pinot Noir Red
Bordeaux Margaux
Napa Valley Bordeaux Blend
Bordeaux Margaux
Bordeaux Pauillac
Californian Sauvignon Blanc
Burgundy White
Oregon Pinot Noir
Spanish Rioja White
Burgundy Côte de Nuits Red
Italian Montepulciano d'Abruzzo
Italian Barolo
Southern Rhône Châteauneuf-du-Pape Red
Burgundy White
Burgundy Côte de Beaune White
Austrian Riesling
Spanish Rosé
Burgundy Côte de Beaune Red
Burgundy Côte de Nuits Red
Italian Barolo
Burgundy Côte de Nuits Red
Lebanese White
Californian Pinot Noir
Burgundy Côte de Nuits Red
French Champagne
Californian Rhône Blend Red
Loire Chenin Blanc
Californian Sparkling
French Champagne
Burgundy Red
Burgundy Côte de Nuits Red
Northern Rhône Cornas
Burgundy Chablis
Bordeaux Haut-Médoc Red
Australian Viognier
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Spanish Sparkling
Northern Rhône Saint-Joseph
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Colheita Port
Bordeaux Sauternes
Southern Rhône White
French Loire Chenin Blanc Dessert
Burgundy White
Californian Red Blend
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Nuits Red
Spanish Rhône Blend Red
French Champagne
Southern Rhône Red
Burgundy Chablis
Californian Chardonnay
Californian Cabernet Sauvignon
Burgundy White
Northern Rhône White
Greek Nemea Red
Argentinian Mendoza Malbec Red
Northern Rhône Côte-Rotie
Burgundy Red
Burgundy Côte de Nuits Red
Bordeaux Pauillac
Napa Valley Cabernet Sauvignon
Bordeaux White
Single Quinta Vintage Port
Languedoc-Roussillon Red
Burgundy Chablis
Burgundy Côte de Nuits Red
French Champagne
German Riesling
Spanish Rioja Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Napa Valley Cabernet Sauvignon
Spanish Manzanilla Sherry Fortified
Jura Vin Jaune
Burgundy Red
Napa Valley Cabernet Sauvignon
Napa Valley Cabernet Sauvignon
Italian Barolo
Bordeaux Saint-Julien
Southern Rhône Châteauneuf-du-Pape Red
French Champagne
Northern Rhône White
Northern Rhône Condrieu
Burgundy White
Northern Rhône Saint-Joseph
Northern Rhône White
French White
Northern Rhône Cornas
Burgundy Côte de Beaune White
Burgundy Côte de Beaune White
Burgundy Côte de Beaune Red
Bordeaux Red
Burgundy Côte de Beaune White
Napa Valley Cabernet Sauvignon
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Napa Valley Bordeaux Blend
Burgundy Côte de Beaune White
Spanish Grenache
Californian Zinfandel
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Italian Brunello
Burgundy Côte de Nuits Red
Austrian Riesling
French Champagne
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Californian Sonoma Coast Pinot Noir Red
Burgundy Côte de Beaune Red
Loire Muscadet
Northern Rhône Crozes-Hermitage
Burgundy Côte de Beaune White
Californian Rosé
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Upper Loire Red
Burgundy Côte de Beaune Red
Tuscan Red
Burgundy White
Italian Barolo
Provence Rosé
Napa Valley Cabernet Sauvignon
Burgundy Côte de Beaune White
French Champagne
Napa Valley Cabernet Sauvignon
Burgundy Red
Bordeaux Margaux
Northern Rhône Côte-Rotie
Burgundy Côte de Nuits Red
French Champagne
French Champagne
Central Italy Red
Californian Zinfandel
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Spanish Fino Sherry Fortified
Oregon Chardonnay
Burgundy Chablis
Burgundy Red
German Spätburgunder
Northern Italy White
Californian Anderson Valley Pinot Noir Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Northern Italy White
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Italian Brunello
Bordeaux Sauternes
Bordeaux Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Greek Nemea Red
Burgundy Côte de Beaune Red
Burgundy Chablis
French Languedoc-Roussillon Fortified
Burgundy Côte de Nuits Red
French Méditerranée White
Italian Chianti Classico Red
South Australia Grenache Red
Burgundy Red
Californian Zinfandel
French Champagne
Northern Rhône Côte-Rotie
Burgundy Côte de Beaune White
Burgundy Côte de Beaune Red
Alsace Riesling
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune Red
Northern Rhône White
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Nuits Red
French Champagne
Bordeaux Saint-Julien
Burgundy White
Bordeaux Margaux
Spanish Ribera Del Duero Red
Bordeaux Pauillac
Burgundy Côte de Beaune White
French Champagne
Spanish Priorat Red
Burgundy Côte de Nuits Red
Bordeaux Sauternes
Italian Chianti Classico Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Southern Italy Red
South Australia Shiraz
Bordeaux Pessac-Léognan
French Loire Rosé
Napa Valley Cabernet Sauvignon
Californian Sta. Rita Hills Pinot Noir Red
Australian Hunter Valley Sémillon White
Australian Rhône Blend Red
Burgundy Côte de Nuits Red
Washington Red
Oregon Chardonnay
Spanish Rioja White
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Central Italy Red
Californian Russian River Valley Pinot Noir Red
Languedoc-Roussillon Red
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Italian Franciacorta Sparkling
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
French Provence Red
Alsace Riesling
Italian Barolo
Alsace Riesling
French Loire Chenin Blanc Dessert
French Champagne
Spanish White
Burgundy Côte de Beaune Red
Italian Bolgheri
Jura White
Burgundy Côte de Beaune Red
Southern Rhône Red
Bordeaux Saint-Julien
Burgundy Côte de Beaune Red
Californian Chardonnay
Oregon Pinot Noir
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Bordeaux Saint-Émilion
Languedoc-Roussillon Red
Macvin
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune Red
French Champagne
Spanish Priorat Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Languedoc-Roussillon White
Oregon Pinot Noir
Napa Valley Cabernet Sauvignon
Macvin
Burgundy Côte de Beaune White
French Champagne
French Champagne
Burgundy Chablis
Italian Chianti
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Californian Chardonnay
French Champagne
Burgundy Côte de Nuits Red
Austrian Rosé
Burgundy Chablis
French Champagne
Northern Rhône Côte-Rotie
Burgundy Côte de Nuits Red
French Champagne
South African Chenin Blanc
Northern Rhône White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Australian Chardonnay
French Champagne
Italian Nebbiolo
Burgundy Côte de Nuits Red
Jura White
Burgundy Côte de Beaune Red
French Champagne
Bordeaux Pomerol
German Riesling
Bordeaux Pomerol
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Upper Loire White
Burgundy Côte de Beaune White
Italian Bolgheri
Central Italy White
Burgundy Côte de Nuits Red
Oregon Pinot Noir
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Languedoc-Roussillon Red
Burgundy Côte de Nuits Red
French Provence Red
Bordeaux Pauillac
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune White
Burgundy Côte de Beaune Red
French Comtés Rhodaniens Red
Australian Merlot
Burgundy Côte de Beaune White
Burgundy Côte de Beaune Red
French Champagne
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Californian Sonoma Coast Pinot Noir Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Californian Santa Lucia Highlands Pinot Noir Red
Alsace Riesling
German Riesling
French Middle Loire Cabernet Franc Red
Beaujolais Red
Portuguese Madeira
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte Chalonnaise White
French Champagne
Napa Valley Cabernet Sauvignon
French Champagne
Provence Rosé
Washington State Cabernet Sauvignon
Burgundy Côte de Beaune Red
Southern Rhône Red
Spanish Red
French Middle Loire Cabernet Franc Red
Bordeaux Pauillac
French Champagne
Alsace Riesling
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Bordeaux Saint-Émilion
Bordeaux Red
Burgundy Côte de Nuits Red
Burgundy Chablis
Napa Valley Cabernet Sauvignon
Italian Red
Burgundy Côte de Beaune White
Napa Valley Cabernet Sauvignon
Burgundy Côte Chalonnaise White
Bordeaux Pauillac
Burgundy White
Bordeaux Saint-Estèphe
Northern Rhône Hermitage
Californian Grenache Red
French Champagne
Burgundy Côte de Nuits Red
French Champagne
Northern Italy White
Spanish Albariño
Napa Valley Cabernet Sauvignon
Californian Zinfandel
Beaujolais Red
Southern Rhône Châteauneuf-du-Pape Red
Burgundy Côte de Nuits Red
Californian Syrah
Washington State Sauvignon Blanc
Burgundy Côte de Beaune White
Californian Santa Barbara County Chardonnay White
Californian Russian River Valley Pinot Noir Red
French Champagne
Italian Valpolicella Red
French Champagne
Burgundy Côte de Nuits Red
Italian Barolo
Burgundy Côte de Nuits Red
Australian Pinot Noir
Californian Rhône Blend Red
Californian Syrah
Napa Valley Cabernet Sauvignon
Californian Sparkling
Burgundy White
Austrian Riesling
German Riesling
Loire Chenin Blanc
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Napa Valley Cabernet Sauvignon
Burgundy Côte de Beaune White
French Champagne
Burgundy Côte de Nuits Red
Northern Rhône Cornas
Burgundy Côte de Nuits Red
Tuscan Red
Southern Italy Red
Southern Rhône White
Northern Rhône Saint-Joseph
Burgundy Côte de Beaune Red
Spanish Rioja White
Northern Rhône Saint-Joseph
Californian Sonoma Coast Pinot Noir Red
Californian Sonoma Coast Pinot Noir Red
Austrian Grüner Veltliner
Italian Barolo
Californian Syrah
Californian White
Californian Sonoma Coast Pinot Noir Red
French Champagne
French Champagne
Napa Valley Bordeaux Blend
Napa Valley Cabernet Sauvignon
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Northern Rhône White
Bordeaux Saint-Julien
Burgundy Côte de Nuits Red
Burgundy White
Burgundy Côte de Beaune Red
Lebanese Red
Spanish Grenache
Burgundy Côte de Nuits Red
Californian Sonoma Coast Pinot Noir Red
Greek Red
California Red
French Champagne
Burgundy Côte de Beaune Red
Californian Sauvignon Blanc
Burgundy Côte de Nuits Red
Californian Alexander Valley Cabernet Sauvignon Red
Oregon Pinot Noir
Burgundy Côte de Beaune Red
Californian Sauvignon Blanc
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Southwest France Malbec
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Southern Italy Red
German Riesling
Burgundy Côte de Beaune White
Upper Loire White
French Middle Loire Cabernet Franc Red
Provence Rosé
Californian Sauvignon Blanc
Californian Russian River Valley Chardonnay White
Italian Barbaresco
Burgundy Côte de Beaune White
French White
Northern Italy Pinot Grigio
Californian Anderson Valley Pinot Noir Red
Burgundy Côte de Beaune Red
Australian Adelaide Hills Shiraz
Portuguese Douro Red
Californian Merlot
Bordeaux Pomerol
Burgundy Côte de Nuits Red
Napa Valley Cabernet Sauvignon
Californian Zinfandel
Napa Valley Chardonnay
Burgundy Côte de Nuits Red
French Champagne
French Champagne
Burgundy Chablis
Austrian Riesling
Burgundy Côte de Nuits Red
Napa Valley Bordeaux Blend
Burgundy Côte de Nuits Red
Northern Rhône Saint-Joseph
Burgundy Côte de Beaune White
Napa Valley Cabernet Sauvignon
Burgundy Côte de Beaune White
Jura White
Provence Rosé
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
French Champagne
Californian Bordeaux Blend
Northern Rhône Côte-Rotie
Oregon Pinot Noir Rosé
Burgundy Côte de Nuits Red
Californian Russian River Valley Chardonnay White
Port
Greek Red
Italian Montepulciano d'Abruzzo
White Port
Napa Valley Chardonnay
French Champagne
South African Chenin Blanc
Languedoc-Roussillon Red
Austrian Riesling
French Champagne
Californian Santa Barbara County Chardonnay White
Portuguese Douro Red
Alsace Pinot Gris
Central Italy White
Southern Rhône White
French Champagne
Spanish Cava
French Champagne
South Australia Shiraz
German Riesling
Californian Sonoma Coast Pinot Noir Red
Burgundy Côte de Beaune White
Burgundy White
Bordeaux Red
Italian Brunello
Argentinian Syrah
Australian Cabernet - Shiraz
Burgundy Côte de Beaune Red
Napa Valley Cabernet Sauvignon
Californian Cabernet Sauvignon
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Burgundy Côte de Nuits Red
Californian Alexander Valley Cabernet Sauvignon Red
Burgundy Côte de Beaune White
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Northern Rhône Saint-Joseph
Spanish Ribera Del Duero Red
Burgundy Côte de Nuits Red
Bordeaux Pomerol
French Champagne
Napa Valley Cabernet Sauvignon
Burgundy Côte de Beaune Red
Burgundy Côte de Nuits Red
Burgundy Mâconnais White
Argentinian Chardonnay
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Australian Pinot Noir
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
French Champagne
Burgundy Côte de Beaune White
French Champagne
Bordeaux Saint-Estèphe
Northern Italy Red
Southern Rhône Châteauneuf-du-Pape Red
Californian Sta. Rita Hills Pinot Noir Red
Burgundy Mâconnais White
French Red
French Champagne
Northern Italy White
Burgundy White
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Oregon Pinot Noir
Burgundy Côte de Nuits Red
Tawny Port
Burgundy Côte de Beaune White
Italian Barbera
Burgundy Côte de Beaune White
Burgundy White
Burgundy Côte de Nuits Red
Languedoc-Roussillon Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Burgundy Côte de Nuits Red
Spanish Priorat Red
Oregon Pinot Noir
Beaujolais Red
Greek
Southern Rhône Châteauneuf-du-Pape Red
Burgundy Côte de Beaune Red
German Riesling
Burgundy Côte de Nuits Red
Southern Rhône Châteauneuf-du-Pape Red
French Champagne
Californian Santa Barbara County Chardonnay White
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Argentinian Red
Burgundy Côte de Nuits Red
Napa Valley Cabernet Sauvignon
French Red
French Champagne
French Champagne
Burgundy Côte de Beaune White
Burgundy Côte de Beaune White
Napa Valley Chardonnay
Burgundy Côte de Nuits Red
Italian Bolgheri
Central Italy White
Upper Loire White
South African Dessert
Burgundy Côte de Beaune Red
Italian Barbaresco
Burgundy Côte de Beaune White
Italian Barbera
Californian Merlot
French Champagne
Burgundy Côte de Nuits Red
Northern Rhône Cornas
French Middle Loire Cabernet Franc Red
Napa Valley Chardonnay
Italian Barbaresco
Burgundy White
Italian Bolgheri
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Bordeaux Saint-Julien
Beaujolais Red
Central Italy White
Spanish Grenache
French Sparkling
Southern Rhône Red
Burgundy Red
Burgundy Côte de Beaune White
Austrian Grüner Veltliner
Burgundy Côte de Beaune White
Loire Chenin Blanc
Californian Sonoma Coast Chardonnay White
French Bordeaux Rosé
Burgundy Côte de Nuits Red
Californian Bordeaux Blend
Californian Pinot Noir
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
French Champagne
Burgundy White
Washington State Merlot
Spanish Rioja Red
Tuscan Red
Southern Italy Red
Spanish Fino Sherry Fortified
Northern Rhône Saint-Joseph
Californian Sta. Rita Hills Pinot Noir Red
Spanish Priorat Red
Southern Rhône Red
Spanish Sparkling
French White
Burgundy Côte de Beaune White
French Champagne
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Italian Amarone
Tawny Port
Italian Barbaresco
Oregon Pinot Noir
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Burgundy Chablis
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Northern Italy White
Jura White
Burgundy Côte de Nuits Red
Tuscan Red
Spanish Rioja Red
Bordeaux Sauternes
Californian Sauvignon Blanc
Burgundy Côte de Beaune White
Burgundy Red
Argentinian Uco Valley Malbec Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Bordeaux White
Burgundy Côte de Beaune Red
Burgundy Côte de Nuits Red
Bordeaux Saint-Estèphe
French Champagne
Burgundy Côte de Beaune Red
Bordeaux Saint-Julien
New Zealand Chardonnay
Burgundy Mâconnais White
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune Red
Burgundy Côte de Beaune White
Burgundy White
Southern Rhône White
French Champagne
German Spätburgunder
Bordeaux Sauternes
Burgundy Côte de Beaune Red
Burgundy Côte de Nuits Red
Californian Syrah
Central Italy White
Texas Red
Bordeaux Saint-Émilion
South African Pinot Noir
Spanish Rioja Red
Burgundy Côte de Nuits Red
Mexican Rose
Italian Barolo
Tuscan Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Oregon Pinot Noir
Napa Valley Cabernet Sauvignon
French Sparkling
Burgundy Côte de Nuits Red
Portuguese Douro Red
Burgundy Côte de Beaune White
Napa Valley Cabernet Sauvignon
Californian Rosé
Beaujolais Red
French Champagne
New Zealand Chardonnay
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Bordeaux Pomerol
Napa Valley Cabernet Sauvignon
Tuscan Red
Burgundy Côte de Nuits Red
Lebanese Red
South African Cinsault Red
French Champagne
Burgundy Côte Chalonnaise Red
Burgundy Côte de Nuits Red
Spanish Mencia
Languedoc-Roussillon Red
French Comtés Rhodaniens Red
Spanish Rioja Red
Southern Rhône White
Northern Italy White
Northern Rhône Saint-Joseph
Bordeaux Saint-Émilion
Spanish Cava
French Champagne
Californian Sonoma County Cabernet Sauvignon Red
Burgundy Côte de Beaune White
Californian Red Blend
German Riesling
Lebanese Red
Burgundy Côte de Beaune White
Napa Valley Cabernet Sauvignon
Californian Sonoma Coast Chardonnay White
Californian Russian River Valley Chardonnay White
Italian Bolgheri
Northern Rhône Côte-Rotie
Burgundy Côte de Beaune White
South African White
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Austrian Blaufränkisch
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
French Champagne
French Red
Burgundy Red
Burgundy White
French Champagne
Burgundy Côte de Beaune White
Burgundy Côte de Beaune White
Californian Sonoma County Cabernet Sauvignon Red
Northern Rhône Cornas
Burgundy Côte de Nuits Red
Italian Bolgheri
Northern Rhône Cornas
Burgundy Côte de Beaune Red
Provence Rosé
Burgundy Côte de Beaune White
French Provence Red
Southern Rhône Red
Californian Alexander Valley Cabernet Sauvignon Red
Bordeaux Saint-Julien
Burgundy White
Loire Chenin Blanc
Bordeaux Pessac-Léognan
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Nuits Red
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
French White
Californian Red Blend
French Jura Red
Californian Sta. Rita Hills Pinot Noir Red
Burgundy Chablis
Burgundy Côte de Beaune White
Bordeaux Saint-Julien
Champagne
Alsace Riesling
Burgundy Côte de Nuits Red
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Californian Sonoma County Cabernet Sauvignon Red
Californian Sonoma Coast Chardonnay White
Northern Italy Pinot Blanc
Burgundy Côte de Beaune White
Californian Sauvignon Blanc
Burgundy Côte de Nuits Red
French Loire Chenin Blanc Dessert
French Corsica Red
South African Red
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Nuits Red
South Australia Grenache Red
Austrian Riesling
Loire Touraine Sauvignon Blanc
Burgundy Côte de Beaune Red
Australian McLaren Vale Shiraz
Burgundy Côte de Beaune White
Burgundy Red
German Riesling
Burgundy Côte de Nuits Red
French Rosé
Burgundy Côte de Nuits Red
Spanish Red
Italian Barolo
Burgundy White
Burgundy Côte de Beaune White
German Riesling
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Californian Syrah
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Nuits Red
Australian Cabernet Sauvignon
Burgundy Côte de Nuits Red
Bordeaux Pauillac
Bordeaux Saint-Émilion
Burgundy Côte de Beaune White
Burgundy Côte de Beaune White
Greek Red
Argentinian Mendoza Malbec Red
Upper Loire White
Spanish Rioja Red
Australian Rosé
Burgundy Côte de Nuits Red
Languedoc-Roussillon White
Burgundy Côte de Beaune White
French Champagne
Californian Grenache Red
French Alsace Gewürztraminer Dessert
Northern Rhône Hermitage
Lebanese Red
French Rosé
Burgundy Côte de Beaune White
Washington State Cabernet Sauvignon
Napa Valley Cabernet Sauvignon
Northern Rhône Condrieu
Burgundy Côte de Nuits Red
French Champagne
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
German Spätburgunder
Burgundy Côte de Nuits Red
Burgundy Mâconnais White
Northern Rhône White
Napa Valley Cabernet Sauvignon
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
Languedoc-Roussillon Rosé
French Champagne
French Champagne
Upper Loire Red
Oregon Cabernet Franc Red
Burgundy Red
Argentinian Uco Valley Malbec Red
Northern Rhône Saint-Joseph
Californian Chardonnay
French Champagne
Californian Sauvignon Blanc
Californian Paso Robles Cabernet Sauvignon Red
German Riesling
Bordeaux White
Burgundy Côte de Beaune White
Bordeaux Pomerol
Australian Pinot Noir
Burgundy Côte de Beaune White
Burgundy Côte de Beaune White
French Sparkling
Oregon Chardonnay
Jura White
South African Chardonnay
Italian Montepulciano d'Abruzzo
Beaujolais Red
Northern Rhône Côte-Rotie
Californian Red Blend
South Australia Grenache Red
French Champagne
Californian Cabernet Sauvignon
Burgundy Côte de Nuits Red
Alsace Riesling
Southern Rhône Red
Burgundy Côte de Nuits Red
Italian Prosecco
Italian Amarone
Californian Chardonnay
Burgundy Côte de Nuits Red
Spanish Ribera Del Duero Red
Burgundy Côte de Nuits Red
Californian Sonoma Coast Pinot Noir Red
Napa Valley Cabernet Sauvignon
French Champagne
Portuguese Vinho Verde White
Californian Merlot
French Champagne
Northern Rhône Crozes-Hermitage
Bordeaux Pauillac
Bordeaux Pessac-Léognan
Burgundy Côte de Beaune Red
Italian Montepulciano d'Abruzzo
Oregon Pinot Noir
Burgundy Côte de Nuits Red
Bordeaux Sauternes
Burgundy Côte de Beaune White
Californian Sonoma Coast Pinot Noir Red
Burgundy Côte de Nuits Red
Tuscan Red
Italian Barolo
Burgundy Côte Chalonnaise White
White Port
Burgundy Mâconnais White
Italian Sparkling
Argentinian Uco Valley Malbec Red
Provence Rosé
Napa Valley Bordeaux Blend
French Champagne
Australian Pinot Noir
Burgundy Côte de Beaune White
Burgundy Côte de Nuits Red
Californian Merlot
French Champagne
Spanish Grenache
Burgundy Côte de Beaune White
Bordeaux Margaux
French Champagne
Beaujolais Red
Burgundy Côte de Nuits Red
Beaujolais Red
Tuscan Red
French Provence Red
Beaujolais Red
French Champagne
Burgundy Côte de Beaune White
Californian Rosé
Northern Rhône Côte-Rotie
Provence Rosé
Burgundy Red
Bordeaux Saint-Julien
Napa Valley Chardonnay
Napa Valley Cabernet Sauvignon
Burgundy Côte de Nuits Red
Californian Syrah
Burgundy Chablis
Bordeaux Saint-Estèphe
Austrian Grüner Veltliner
Burgundy Côte de Beaune Red
Oregon Pinot Noir
Bordeaux Saint-Julien
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune Red
Southern Rhône Châteauneuf-du-Pape Red
French Champagne
Oregon Viognier White
Southern Italy Red
Californian White
Napa Valley Cabernet Sauvignon
Burgundy Côte de Beaune Red
Australian Hunter Valley Sémillon White
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
Burgundy Côte de Beaune White
French White
Spanish White
Champagne
Bordeaux Sauternes
Oregon White
Italian Montepulciano d'Abruzzo
Spanish Cava
French Loire Rosé
Burgundy Red
Burgundy Côte de Beaune Red
Californian Bordeaux Blend
French Champagne
Burgundy Côte de Nuits Red
Australian Barossa Valley Shiraz
Burgundy Côte de Nuits Red
Austrian Grüner Veltliner
Languedoc-Roussillon White
French Loire Rosé
French Champagne
Italian Montepulciano d'Abruzzo
Spanish Montsant Red
Northern Rhône Condrieu
Bordeaux Pomerol
Californian Santa Barbara County Chardonnay White
Burgundy Côte de Beaune White
German Riesling
Italian Red
Northern Rhône Côte-Rotie
Burgundy White
Californian Santa Lucia Highlands Pinot Noir Red
Burgundy Côte de Nuits Red
Burgundy Côte de Nuits Red
French Champagne
French Méditerranée Red
Californian Red Blend
Austrian Riesling
Burgundy Côte de Nuits Red
"""

# Process the data
regions = [line.strip() for line in data.split('\n') if line.strip()]
total = len(regions)
unique_regions = set(regions)
unique_count = len(unique_regions)

# Count occurrences
from collections import Counter
region_counts = Counter(regions)

# Print results
print(f"Total quantity: {total}")
print(f"Number of unique regions: {unique_count}\n")


# Sort by count descending, then region name ascending
sorted_counts = sorted(region_counts.items(), key=lambda x: (-x[1], x[0]))

for region, count in sorted_counts:
    print(f"{region}: {count}")