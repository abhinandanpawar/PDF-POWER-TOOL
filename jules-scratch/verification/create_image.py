from PIL import Image

# Create a 100x50 white image
img = Image.new('RGB', (100, 50), color = 'white')
img.save('jules-scratch/verification/test.png', 'PNG')
