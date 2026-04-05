import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CategoryManager } from '@/components/categories/CategoryManager';

export default function CategoriesPage() {
  return (
    <PageContainer title="Categorías" subtitle="Gestiona tus categorías de gastos e ingresos">
      <CategoryManager />
    </PageContainer>
  );
}
