<template>
  <div>
    <p>
      Capture:
      <select v-model="selected">
        <option
          v-for="option in options"
          :key="option.text"
          :value="option"
        >
          {{ option.text }}
        </option>
      </select>
    </p>

    <hr />

    <p class="decode-result">
      Last result: <b>{{ result }}</b>
    </p>

    <qrcode-capture
      @detect="onDetect"
      :capture="selected.value"
       :formats="['code_128','code_39','code_93','codabar','databar','databar_expanded','data_matrix','aztec','rm_qr_code']"
    />
  </div>
</template>

<script>
import { QrcodeCapture } from 'vue-qrcode-reader';

export default {
  components: { QrcodeCapture },

  data() {
    const options = [
      { text: 'rear camera (default)', value: 'environment' },
      { text: 'front camera', value: 'user' },
      { text: 'force file dialog', value: null }
    ]
    const barcodeFormats = {
  aztec: true,
  code_128: true,
  code_39: true,
  code_93: true,
  codabar: true,
  databar: true,
  databar_expanded: true,
  data_matrix: true,
  dx_film_edge: true,
  ean_13: true,
  ean_8: true,
  itf: true,
  maxi_code: false,
  micro_qr_code: false,
  pdf417: false,
  qr_code: true,
  rm_qr_code: false,
  upc_a: false,
  upc_e: false,
  linear_codes: false,
  matrix_codes: false
}

    return {
      result: '',
      options,
      selected: options[0]
    }
  },

  methods: {
    onDetect(detectedCodes) {
      console.log(detectedCodes)

      this.result = JSON.stringify(detectedCodes.map((code) => code.rawValue))
    }
  }
}
</script>