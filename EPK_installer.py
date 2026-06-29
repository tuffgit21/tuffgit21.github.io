import urllib.request
import sys
import time
for i in range(101):
    sys.stdout.write("\rDownloading EPK... {}%".format(i))
    sys.stdout.flush()
    time.sleep(1)
print("\nEPK downloaded!")
url = "https://tuffgit21.github.io/EPK.zip"
urllib.request.urlretrieve(url, "EPK.zip")
