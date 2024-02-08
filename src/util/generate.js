function generateUniquePokerId() {
    // const uuid = uuidv4(); 
    // return 'poker' + uuid.slice(5); // Concatenate "poker" and a slice of the UUID
    const timestamp = Date.now().toString();
    const randomChars = Math.random().toString(36).substr(2, 5);
    const gameId = 'poker' + timestamp.slice(-10) + randomChars;
    return gameId;
}