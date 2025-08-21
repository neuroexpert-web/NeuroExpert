// Пример теста для демонстрации работы Jest и покрытия кода

describe('Example Test Suite', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle strings', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toContain('Hello');
    expect(greeting).toHaveLength(13);
  });

  test('should work with objects', () => {
    const user = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
    };

    expect(user).toHaveProperty('name');
    expect(user.age).toBeGreaterThan(18);
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('should handle arrays', () => {
    const numbers = [1, 2, 3, 4, 5];

    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers[0]).toBe(1);
  });

  test('should test async operations', async () => {
    const fetchData = () => Promise.resolve('data');

    const data = await fetchData();
    expect(data).toBe('data');
  });
});
