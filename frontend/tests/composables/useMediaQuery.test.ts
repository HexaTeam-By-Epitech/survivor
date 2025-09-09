import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useMediaQuery } from '@/composables/useMediaQuery';

// Mock component to test the composable
const TestComponent = {
  template: '<div>{{ isMobile }}</div>',
  setup() {
    const isMobile = useMediaQuery('(max-width: 639px)');
    return { isMobile };
  }
};

describe('useMediaQuery', () => {
  let mockMatchMedia: any;

  beforeEach(() => {
    mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 639px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns correct initial value', async () => {
    const wrapper = mount(TestComponent);
    await nextTick();
    
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 639px)');
    expect(wrapper.text()).toBe('true');
  });

  it('sets up event listeners', () => {
    const wrapper = mount(TestComponent);
    const mediaQuery = mockMatchMedia.mock.results[0].value;
    
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});