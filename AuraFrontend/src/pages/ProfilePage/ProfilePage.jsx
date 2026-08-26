import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { updateProfile } from '../../api/authService';
import { getAllOrders, deleteOrder } from '../../api/orderService';
import { getAllAddresses, createAddress, updateAddress, deleteAddress } from '../../api/addressService';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import AddressFormModal from '../../components/organisms/AddressFormModal/AddressFormModal';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout, refetchUser } = useAuth();
  const { favorites } = useFavorites();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Edit Profile modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    userName: '',
    email: '',
    profileImageUrl: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // Populate form when user is loaded
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        surname: user.surname || '',
        userName: user.userName || '',
        email: user.email || '',
        profileImageUrl: user.profileImageUrl || '',
      });
    }
  }, [user]);

  // Load backend user collections
  const loadUserData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [ordersRes, addressesRes] = await Promise.allSettled([
        getAllOrders(),
        getAllAddresses(),
      ]);

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }

      if (addressesRes.status === 'fulfilled' && Array.isArray(addressesRes.value)) {
        setAddresses(addressesRes.value);
      }
    } catch (err) {
      console.warn('ProfilePage: Error loading user details from backend', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData, location.key]);

  if (!user) return null;

  const getStatusTranslation = (status) => {
    const statusMap = {
      0: 'Pending',
      1: 'Confirmed',
      2: 'Preparing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled',
      'Pending': 'Pending',
      'Confirmed': 'Confirmed',
      'Preparing': 'Preparing',
      'Shipped': 'Shipped',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled'
    };
    const key = statusMap[status] || 'Pending';
    return t(`orderStatus.${key}`, key);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(t('profile.cancelConfirm'))) {
      try {
        await deleteOrder(orderId);
        await loadUserData();
      } catch (err) {
        console.error("Failed to cancel order", err);
        alert(t('common.error'));
      }
    }
  };

  const fullName = [user.name, user.surname].filter(Boolean).join(' ') || t('profile.headerTitle');
  const initial = (fullName || user.email || 'A')[0].toUpperCase();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateMessage(null);
    setUpdateLoading(true);

    try {
      await updateProfile(editForm);
      await refetchUser();
      setUpdateMessage(t('auth.profileUpdated'));
      setIsEditing(false);
    } catch (err) {
      const msg = err?.response?.data?.message || t('common.error');
      setUpdateError(msg);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddAddressClick = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm(t('common.delete') + '?')) {
      try {
        await deleteAddress(id);
        await loadUserData();
      } catch (err) {
        console.error(err);
        alert(t('common.error'));
      }
    }
  };

  const handleAddressSubmit = async (formData, id) => {
    if (id) {
      await updateAddress({ ...formData, id });
    } else {
      await createAddress(formData);
    }
    await loadUserData();
  };

  return (
    <main className={`page-shell ${styles.container}`}>
      {/* Profile Header Card */}
      <section className={styles['profile-header']}>
        <div className={styles['header-main']}>
          <div className={styles['avatar-container']}>
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={fullName} className={styles['avatar-image']} />
            ) : (
              <div className={styles['avatar-circle']}>{initial}</div>
            )}
          </div>
          <div className={styles['user-meta']}>
            <div className={styles['name-row']}>
              <h1>{fullName}</h1>
              {user.userName && <span className={styles['user-handle']}>@{user.userName}</span>}
            </div>
            <p className={styles['user-email']}>{user.email}</p>
            <button
              type="button"
              className={styles['edit-btn']}
              onClick={() => setIsEditing(true)}
            >
              {t('profile.editProfile')}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles['stats-grid']}>

          <div className={styles['stat-card']} onClick={() => setActiveTab('orders')}>
            <span className={styles['stat-number']}>{orders.length}</span>
            <span className={styles['stat-label']}>{t('profile.ordersStat')}</span>
          </div>
          <div className={styles['stat-card']} onClick={() => setActiveTab('addresses')}>
            <span className={styles['stat-number']}>{addresses.length}</span>
            <span className={styles['stat-label']}>{t('profile.addressesStat')}</span>
          </div>
        </div>
      </section>

      {/* Profile Navigation Tabs */}
      <nav className={styles['tabs-nav']} aria-label="Profile navigation">
        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {t('profile.ordersTab', { count: orders.length })}
        </button>

        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'addresses' ? styles.active : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          {t('profile.addressesTab', { count: addresses.length })}
        </button>
        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          {t('profile.settingsTab')}
        </button>
      </nav>

      {/* Tab Panels */}
      <section className={styles['tab-content']}>
        {updateMessage && <div className={styles['success-banner']}>{updateMessage}</div>}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className={styles['panel']}>
            <h2>{t('profile.orderHistory')}</h2>
            {loadingData ? (
              <p className={styles['empty-state']}>{t('profile.loadingOrders')}</p>
            ) : orders.length === 0 ? (
              <div className={styles['empty-box']}>
                <p>{t('profile.noOrders')}</p>
                <Link to="/" className={styles['action-link']}>{t('profile.browseCatalog')}</Link>
              </div>
            ) : (
              <div className={styles['orders-list']}>
                {orders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).map((order) => (
                  <article key={order.id} className={styles['order-card']}>
                    <div className={styles['order-header']}>
                      <div>
                        <span className={styles['order-id']}>
                          {t('profile.orderId', { id: order.id.slice(0, 8) })}
                        </span>
                        <span style={{marginLeft: '12px', color: '#888', fontSize: '0.9rem'}}>
                          {order.createdDate ? new Date(order.createdDate).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <span className={`${styles['order-status']} ${styles[getStatusTranslation(order.status).toLowerCase()] || ''}`}>
                        {getStatusTranslation(order.status)}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', marginTop: '1rem' }}>
                      {order.orderItems && order.orderItems.length > 0 ? (
                        order.orderItems.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#555', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {item.imageUrl && (
                                <img src={getImageUrl(item.imageUrl)} alt={item.productName || t('checkout.product')} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} onError={handleImageError} />
                              )}
                              <span>{item.quantity}x {item.productName || t('checkout.product')}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                              <Link to={`/product/${item.productId}`} className={styles['fav-view-btn']}>
                                {t('favorites.viewDetails')}
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span style={{color: '#666'}}>{t('profile.noProduct')}</span>
                      )}
                    </div>
                    
                    <div className={styles['order-body']} style={{ marginTop: '1rem' }}>
                      <p className={styles['order-total']} style={{ borderTop: '1px solid #eee', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{t('profile.orderTotal')}: <strong>${order.totalPrice?.toFixed(2)}</strong></span>
                        {(order.status === 0 || order.status === 1 || order.status === 'Pending' || order.status === 'Confirmed') && (
                          <button 
                            className={styles['cancel-order-btn']}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            {t('profile.cancelOrder')}
                          </button>
                        )}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}



        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className={styles['panel']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>{t('profile.savedAddresses')}</h2>
            </div>
            {addresses.length === 0 ? (
              <div className={styles['empty-box']}>
                <p>{t('profile.noAddresses')}</p>
              </div>
            ) : (
              <div className={styles['address-grid']}>
                {addresses.map((addr) => (
                  <div key={addr.id} className={styles['address-card']} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <strong>{addr.street}</strong>
                      <p>{addr.city}, {addr.country} {addr.zipCode}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      <button className={styles['edit-btn']} style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => handleEditAddressClick(addr)}>
                        {t('common.edit')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings / Edit Tab */}
        {activeTab === 'settings' && (
          <div className={styles['panel']}>
            <h2>{t('profile.accountSettings')}</h2>
            <form onSubmit={handleEditSubmit} className={styles['settings-form']}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label>{t('auth.firstName')}</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>{t('auth.lastName')}</label>
                  <input
                    type="text"
                    value={editForm.surname}
                    onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles['form-group']}>
                <label>{t('auth.username')}</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>

              {updateError && <div className={styles['error-banner']}>{updateError}</div>}

              <button type="submit" className={styles['save-btn']} disabled={updateLoading}>
                {updateLoading ? t('profile.saving') : t('profile.saveChanges')}
              </button>
            </form>

            <div className={styles['danger-zone']}>
              <h3>{t('profile.session')}</h3>
              <button type="button" className={styles['logout-btn']} onClick={logout}>
                {t('profile.signOut')}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modal for Edit Profile */}
      {isEditing && (
        <div className={styles['modal-overlay']} onClick={() => setIsEditing(false)}>
          <div className={styles['modal-card']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h2>{t('profile.editModalTitle')}</h2>
              <button type="button" className={styles['close-btn']} onClick={() => setIsEditing(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles['settings-form']}>
              <div className={styles['form-group']}>
                <label>{t('auth.firstName')}</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>{t('auth.lastName')}</label>
                <input
                  type="text"
                  value={editForm.surname}
                  onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>{t('auth.username')}</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>

              {updateError && <div className={styles['error-banner']}>{updateError}</div>}

              <div className={styles['modal-actions']}>
                <button type="button" className={styles['cancel-btn']} onClick={() => setIsEditing(false)}>
                  {t('profile.cancel')}
                </button>
                <button type="submit" className={styles['save-btn']} disabled={updateLoading}>
                  {updateLoading ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AddressFormModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddressSubmit}
        initialData={editingAddress}
      />
    </main>
  );
}
