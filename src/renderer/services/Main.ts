import ElectronApi from "@/types/electron"


export default new class Main {
  public API: ElectronApi = null

  constructor() {
    this.API = typeof window !== 'undefined' ? window.api : null
  }
}