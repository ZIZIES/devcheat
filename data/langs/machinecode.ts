import { lang, section, card } from '../helpers';

export default lang({
  id: "machinecode", name: "Machine Code", ext: ".bin", year: 1945, common: false,
  sections: [
    section("basics", "basics", [
      card("what machine code is", {
        beginner: {
          explanation: "Machine code is the raw bytes that the CPU actually executes — every program you've ever run is ultimately machine code. Assembly is human-readable machine code. C, Python, Java — they all eventually become machine code. Understanding machine code helps you understand why code is fast or slow, how exploits work, and what's really happening inside the computer.",
          code: `; you don't write machine code directly — you write assembly
; and the assembler converts it to bytes
; but knowing what those bytes are helps you understand computing

; example: x86-64 "mov rax, 42" (set register rax to 42)
; as assembly:  mov rax, 42
; as hex bytes: 48 B8 2A 00 00 00 00 00 00 00
;               ^^   ^^ ^^ ............. ^^ ^^
;               REX  opcode  42 in little-endian 64-bit

; 48      = REX.W prefix (use 64-bit operand size)
; B8      = MOV rax, imm64 opcode
; 2A 00 00 00 00 00 00 00 = 42 in little-endian bytes
;   2A = 42 in hex, then 7 zero bytes to fill 64 bits

; common x86-64 opcodes (hex)
; 90          = NOP (no operation, does nothing)
; C3          = RET (return from function)
; CC          = INT3 (breakpoint)
; 0F 05       = SYSCALL (call the OS)
; 48 31 C0    = XOR rax, rax (fastest way to zero rax)
; 48 FF C0    = INC rax (rax++)`,
          examples: [
            { input: `# view machine code of a program\nobjdump -d -M intel ./program | head -20`, output: `assembly + hex bytes side by side` },
            { input: `# see bytes\nxxd ./program | head -5`, output: `00000000: 7f45 4c46 0201 0100 0000 0000 0000 0000  .ELF............` },
          ],
          note: "the first 4 bytes of a Linux executable are 7F 45 4C 46 — that's 0x7F followed by 'ELF' in ASCII. this 'magic number' tells the OS this file is an ELF executable. every file format has magic bytes",
        },
        intermediate: {
          explanation: "Little-endian vs big-endian is how multi-byte numbers are stored in memory. x86 uses little-endian (least significant byte first). Networks use big-endian. This causes bugs when you mix the two.",
          code: `; ENDIANNESS — byte order in memory
; The number 0x12345678 in memory:

; Little-endian (x86, ARM, most modern CPUs):
; address: 00 01 02 03
; bytes:   78 56 34 12   (least significant byte FIRST)

; Big-endian (network protocols, some RISC CPUs):
; address: 00 01 02 03
; bytes:   12 34 56 78   (most significant byte FIRST)

; in Python, you can see this:
import struct
n = 0x12345678
struct.pack('<I', n)  # little-endian: b'\x78\x56\x34\x12'
struct.pack('>I', n)  # big-endian:    b'\x12\x34\x56\x78'

; this is why reading a binary file requires knowing the endianness
; if you read a 32-bit number from a network packet and display it
; on your x86 machine, the bytes are in the wrong order!

; htonl = host to network long (converts little to big for network)
; ntohl = network to host long (converts big to little for display)`,
          examples: [
            { input: `import struct\nstruct.pack('<I', 255).hex()`, output: `'ff000000'  # little-endian` },
            { input: `struct.pack('>I', 255).hex()`, output: `'000000ff'  # big-endian` },
          ],
          note: "endianness bugs are silent and evil — your program reads a number, it compiles and runs without error, but the value is completely wrong because the bytes are reversed. always check endianness when reading binary files or network data",
        },
        advanced: {
          explanation: "You can run raw machine code from Python by writing bytes into executable memory. This is how JIT compilers work — they generate machine code at runtime and execute it directly, bypassing the normal compile step.",
          code: `import ctypes, mmap

# write machine code bytes and execute them
# function: return 42

shellcode = bytes([
    0x48, 0xC7, 0xC0,        # mov rax,
    0x2A, 0x00, 0x00, 0x00,  # 42 (0x2A = 42 in hex)
    0xC3                      # ret
])
# total: 8 bytes = 64 bits — a tiny function!

# allocate executable memory (mmap with EXEC permission)
buf = mmap.mmap(
    -1,                # anonymous mapping
    len(shellcode),
    prot = mmap.PROT_READ | mmap.PROT_WRITE | mmap.PROT_EXEC
)
buf.write(shellcode)

# get the address and call it as a function
addr = ctypes.addressof(ctypes.c_char.from_buffer(buf))
fn   = ctypes.CFUNCTYPE(ctypes.c_int64)(addr)
result = fn()   # executes our machine code!
print(result)   # 42

# this is how Python's JIT (experimental) works
# and how projects like NumPy generate fast code at runtime`,
          examples: [
            { input: `python3 shellcode.py`, output: `42  # raw machine code executed!` },
          ],
          note: "modern operating systems prevent running code from normal memory (Data Execution Prevention / NX bit). mmap with PROT_EXEC explicitly asks for executable memory. this is also why many exploits need to bypass DEP/NX",
        },
      }),

      card("reading binary files", {
        beginner: {
          explanation: "Every file on your computer is just bytes. Images, executables, PDFs — they all have a specific format that tells programs how to interpret those bytes. The first few bytes of most files (called 'magic bytes') identify the file type.",
          code: `# Python: read and inspect any binary file
with open('somefile', 'rb') as f:  # 'rb' = read binary
    data = f.read()

# look at first few bytes
print(data[:4].hex())    # hex representation
print(data[:4])          # raw bytes

# common file signatures (magic bytes)
# PNG:  89 50 4E 47 = .PNG
# JPEG: FF D8 FF
# ZIP:  50 4B 03 04 = PK..
# PDF:  25 50 44 46 = %PDF
# ELF:  7F 45 4C 46 = .ELF (Linux executable)
# PE:   4D 5A       = MZ  (Windows .exe/.dll)
# GIF:  47 49 46 38 = GIF8

def identify_file(path):
    with open(path, 'rb') as f:
        magic = f.read(8)

    if magic[:4] == b'\\x89PNG':  return 'PNG image'
    if magic[:2] == b'\\xff\\xd8': return 'JPEG image'
    if magic[:4] == b'PK\\x03\\x04': return 'ZIP archive'
    if magic[:4] == b'%PDF':     return 'PDF document'
    if magic[:4] == b'\\x7fELF':  return 'Linux ELF binary'
    if magic[:2] == b'MZ':       return 'Windows PE binary'
    return 'unknown'`,
          examples: [
            { input: `with open('/bin/ls','rb') as f:\n    print(f.read(4).hex())`, output: `7f454c46  # .ELF — Linux executable` },
            { input: `identify_file('photo.jpg')`, output: `'JPEG image'` },
          ],
          note: "file extensions are just suggestions — a file named photo.txt could actually be a JPEG. programs that trust extensions can be tricked. checking magic bytes is the reliable way to identify file types",
        },
        intermediate: {
          explanation: "Struct packing and unpacking lets you read binary formats precisely — you define exactly how many bytes each field uses and in what byte order. This is how you'd parse a PNG header, a TCP packet, or an ELF binary.",
          code: `import struct

# struct format string:
# < = little-endian  > = big-endian
# B = unsigned byte (1)   H = unsigned short (2)
# I = unsigned int  (4)   Q = unsigned long  (8)
# b = signed byte  (1)    h = signed short   (2)
# i = signed int   (4)    q = signed long    (8)
# f = float (4)    d = double (8)
# s = char[] (prefix with length: 4s = 4 bytes)

# parse a simple binary format
def parse_header(data: bytes):
    # assume: magic(4) | version(2) | size(4) | flags(1)
    magic, version, size, flags = struct.unpack_from('>4sHIB', data)
    return {
        'magic':   magic.decode('ascii'),
        'version': version,
        'size':    size,
        'flags':   flags,
    }

# write a binary format
def write_header(magic, version, size, flags):
    return struct.pack('>4sHIB',
        magic.encode('ascii'),
        version, size, flags)

header_bytes = write_header('TEST', 1, 1024, 0b00000011)
parsed = parse_header(header_bytes)`,
          examples: [
            { input: `struct.pack('<IHH', 0xFF, 100, 200).hex()`, output: `ff00000064000000c800  # little-endian` },
            { input: `struct.unpack('<IHH', bytes.fromhex('ff00000064000000c800'))`, output: `(255, 100, 200)` },
          ],
        },
      }),
    ]),
  ],
});
