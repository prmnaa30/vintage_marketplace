<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">
      Admin: Seed Data Products
    </h1>

    <div class="mb-4">
      <p>Status: <span :class="statusColor">{{ status }}</span></p>
    </div>

    <button
      :disabled="isUploading"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      @click="uploadData"
    >
      {{ isUploading ? 'Sedang Upload...' : 'Upload 50 Produk ke Firestore' }}
    </button>
  </div>
</template>

<script setup>
import { doc, writeBatch, Timestamp, getFirestore } from 'firebase/firestore'
import productsData from '~/assets/products.json'

const app = useFirebaseApp()
const db = getFirestore(app)

const isUploading = ref(false)
const status = ref('Ready')
const statusColor = ref('text-gray-600')

const uploadData = async () => {
  if (!confirm('Yakin ingin menimpa/upload data ke koleksi "products"?')) return

  isUploading.value = true
  status.value = 'Memproses...'

  try {
    const batch = writeBatch(db)

    productsData.forEach((product) => {
      const docRef = doc(db, 'products', product.id)

      let validDate
      try {
        const parsedDate = new Date(product.createdAt)
        if (Number.isNaN(parsedDate.getTime())) {
          throw new TypeError('Invalid Date detected')
        }
        validDate = parsedDate
      } catch {
        console.warn(`Format tanggal salah pada ID: ${product.id}. Menggunakan waktu sekarang.`)
        validDate = new Date()
      }

      const dataToUpload = {
        ...product,
        createdAt: Timestamp.fromDate(validDate)
      }

      batch.set(docRef, dataToUpload)
    })

    await batch.commit()

    status.value = `Sukses! ${productsData.length} produk berhasil diupload.`
    statusColor.value = 'text-green-600 font-bold'
  } catch (error) {
    console.error('Error uploading data:', error)
    status.value = 'Gagal: ' + error.message
    statusColor.value = 'text-red-600 font-bold'
  } finally {
    isUploading.value = false
  }
}
</script>
