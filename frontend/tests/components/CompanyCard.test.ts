import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CompanyCard from '@/components/organisms/CompanyCard.vue';
import type { Company } from '@/types/company';

const mockCompany: Company = {
  id: '1',
  name: 'Test Company',
  heroImage: 'https://example.com/image.jpg',
  excerpt: 'A test company description',
  description: 'Longer description',
  tags: ['Tech', 'AI'],
  website: 'https://test.com'
};

describe('CompanyCard', () => {
  it('renders company information correctly', () => {
    const wrapper = mount(CompanyCard, {
      props: { company: mockCompany }
    });

    expect(wrapper.text()).toContain('Test Company');
    expect(wrapper.text()).toContain('A test company description');
    expect(wrapper.text()).toContain('Tech');
    expect(wrapper.text()).toContain('AI');
  });

  it('renders image with correct alt text', () => {
    const wrapper = mount(CompanyCard, {
      props: { company: mockCompany }
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe(mockCompany.heroImage);
    expect(img.attributes('alt')).toContain(mockCompany.name);
  });

  it('shows website link when provided', () => {
    const wrapper = mount(CompanyCard, {
      props: { company: mockCompany }
    });

    const websiteLink = wrapper.find('a[href="https://test.com"]');
    expect(websiteLink.exists()).toBe(true);
  });

  it('applies featured variant class', () => {
    const wrapper = mount(CompanyCard, {
      props: { 
        company: mockCompany,
        variant: 'featured'
      }
    });

    expect(wrapper.classes()).toContain('company-card--featured');
  });
});