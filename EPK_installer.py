import sys
import urllib.request

url = "https://tuffgit21.github.io/EPK.zip"
filename = "EPK.zip"


def report_progress(block_num, block_size, total_size):
    downloaded = block_num * block_size
    if total_size <= 0:
        percent = 0
    else:
        percent = min(100, int(downloaded * 100 / total_size))
    sys.stdout.write(f"\rDownloading EPK... {percent}%")
    sys.stdout.flush()


urllib.request.urlretrieve(url, filename, reporthook=report_progress)
print("\nEPK downloaded!")
