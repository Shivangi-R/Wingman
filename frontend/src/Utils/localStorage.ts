class LocalStorageService {
  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }

  public removeAll() {
    localStorage.clear();
  }
}

let localStorageService = new LocalStorageService();

export default localStorageService;
