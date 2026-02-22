import struct
import zlib
import os

def create_png(width, height, color):
    # PNG Signature
    png_sig = b'\x89PNG\r\n\x1a\n'

    # IHDR Chunk
    # Width, Height, Bit depth (8), Color type (2=Truecolor), Compression (0), Filter (0), Interlace (0)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)

    # IDAT Chunk (Image Data)
    # Scanlines: Filter byte (0) + RGB data for each row
    raw_data = b''
    for _ in range(height):
        raw_data += b'\x00' + color * width

    compressed_data = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)

    # IEND Chunk
    iend_data = b''
    iend_crc = zlib.crc32(b'IEND' + iend_data)
    iend_chunk = struct.pack('>I', len(iend_data)) + b'IEND' + iend_data + struct.pack('>I', iend_crc)

    return png_sig + ihdr_chunk + idat_chunk + iend_chunk

if __name__ == "__main__":
    # Blue color (RGB)
    blue = b'\x3b\x82\xf6' # #3b82f6 (Tailwind blue-500)

    icon_192 = create_png(192, 192, blue)
    icon_512 = create_png(512, 512, blue)

    os.makedirs('portfolio-os/public', exist_ok=True)

    with open('portfolio-os/public/pwa-192x192.png', 'wb') as f:
        f.write(icon_192)

    with open('portfolio-os/public/pwa-512x512.png', 'wb') as f:
        f.write(icon_512)

    print("Generated PWA icons.")
