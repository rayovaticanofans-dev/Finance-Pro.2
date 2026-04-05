import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionDetail } from '@/components/transactions/TransactionDetail';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useFinance } from '@/hooks/useFinance';
import type { Item } from '@/types/finance';

export default function TransactionsPage() {
  const { filteredAndSorted, state, setFilter, setSort, deleteItem } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Item | undefined>(undefined);
  const [detailItem, setDetailItem] = useState<Item | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    state.filter.dateRange,
    state.filter.categories?.length,
    state.filter.types?.length,
    state.filter.amountMin !== undefined,
    state.filter.amountMax !== undefined,
  ].filter(Boolean).length;

  return (
    <PageContainer
      title="Transacciones"
      subtitle={`${filteredAndSorted.length} registros`}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(true)}
          >
            🔍 Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Button>
          <Button variant="primary" size="sm" onClick={() => { setEditItem(undefined); setShowForm(true); }}>
            + Nueva
          </Button>
        </div>
      }
    >
      <TransactionList
        items={filteredAndSorted}
        onItemClick={(item) => setDetailItem(item)}
        onEdit={(item) => { setEditItem(item); setShowForm(true); }}
        onDelete={(id) => deleteItem(id)}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => { setEditItem(undefined); setShowForm(true); }}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
        aria-label="Nueva transacción"
      >
        +
      </button>

      {/* Transaction form modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditItem(undefined); }}
        title={editItem ? 'Editar transacción' : 'Nueva transacción'}
        size="md"
      >
        <TransactionForm
          editItem={editItem}
          onSuccess={() => { setShowForm(false); setEditItem(undefined); }}
          onCancel={() => { setShowForm(false); setEditItem(undefined); }}
        />
      </Modal>

      {/* Transaction detail modal */}
      <Modal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(undefined)}
        title="Detalle"
        size="sm"
      >
        {detailItem && (
          <TransactionDetail
            item={detailItem}
            onEdit={(item) => { setDetailItem(undefined); setEditItem(item); setShowForm(true); }}
            onDelete={(id) => { deleteItem(id); setDetailItem(undefined); }}
            onClose={() => setDetailItem(undefined)}
          />
        )}
      </Modal>

      {/* Filters modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
        size="sm"
      >
        <TransactionFilters
          filter={state.filter}
          sort={state.sort}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onClose={() => setShowFilters(false)}
        />
      </Modal>
    </PageContainer>
  );
}
