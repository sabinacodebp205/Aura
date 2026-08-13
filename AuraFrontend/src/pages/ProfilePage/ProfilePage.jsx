import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { updateProfile } from '../../api/authService';
import { getAllOrders } from '../../api/orderService';
import { getAllDesigns } from '../../api/designService';
import { getAllAddresses } from '../../api/addressService';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, logout, refetchUser } = useAuth();
  const { favorites } = useFavorites();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

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
      const [ordersRes, designsRes, addressesRes] = await Promise.allSettled([
        getAllOrders(),
        getAllDesigns(),
        getAllAddresses(),
      ]);

      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
        setOrders(ordersRes.value);
      }
      if (designsRes.status === 'fulfilled' && Array.isArray(designsRes.value)) {
        setDesigns(designsRes.value);
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
  }, [loadUserData]);

  if (!user) return null;

  const fullName = [user.name, user.surname].filter(Boolean).join(' ') || 'AURA Member';
  const initial = (fullName || user.email || 'A')[0].toUpperCase();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateMessage(null);
    setUpdateLoading(true);

    try {
      await updateProfile(editForm);
      await refetchUser();
      setUpdateMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update profile. Please check inputs.';
      setUpdateError(msg);
    } finally {
      setUpdateLoading(false);
    }
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
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles['stats-grid']}>
          <div className={styles['stat-card']} onClick={() => setActiveTab('favorites')}>
            <span className={styles['stat-number']}>{favorites.length}</span>
            <span className={styles['stat-label']}>Favorites</span>
          </div>
          <div className={styles['stat-card']} onClick={() => setActiveTab('orders')}>
            <span className={styles['stat-number']}>{orders.length}</span>
            <span className={styles['stat-label']}>Orders</span>
          </div>
          <div className={styles['stat-card']} onClick={() => setActiveTab('designs')}>
            <span className={styles['stat-number']}>{designs.length}</span>
            <span className={styles['stat-label']}>My AI Designs</span>
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
          Orders ({orders.length})
        </button>
        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'favorites' ? styles.active : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({favorites.length})
        </button>
        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'designs' ? styles.active : ''}`}
          onClick={() => setActiveTab('designs')}
        >
          My AI Designs ({designs.length})
        </button>
        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'addresses' ? styles.active : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses ({addresses.length})
        </button>
        <button
          type="button"
          className={`${styles['tab-btn']} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Account Settings
        </button>
      </nav>

      {/* Tab Panels */}
      <section className={styles['tab-content']}>
        {updateMessage && <div className={styles['success-banner']}>{updateMessage}</div>}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className={styles['panel']}>
            <h2>Order History</h2>
            {loadingData ? (
              <p className={styles['empty-state']}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className={styles['empty-box']}>
                <p>You haven't placed any orders yet.</p>
                <Link to="/" className={styles['action-link']}>Browse Catalog</Link>
              </div>
            ) : (
              <div className={styles['orders-list']}>
                {orders.map((order) => (
                  <article key={order.id} className={styles['order-card']}>
                    <div className={styles['order-header']}>
                      <div>
                        <span className={styles['order-id']}>Order #{order.id.slice(0, 8)}</span>
                        <span className={styles['order-items-count']}>
                          {order.orderItems?.length || 0} item(s)
                        </span>
                      </div>
                      <span className={styles['order-status']}>{order.status || 'Pending'}</span>
                    </div>
                    <div className={styles['order-body']}>
                      <p className={styles['order-total']}>
                        Total: <strong>${order.totalPrice?.toFixed(2)}</strong>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className={styles['panel']}>
            <h2>Favorite Products</h2>
            {favorites.length === 0 ? (
              <div className={styles['empty-box']}>
                <p>No favorites saved yet.</p>
                <Link to="/" className={styles['action-link']}>Explore Clothing</Link>
              </div>
            ) : (
              <div className={styles['fav-grid']}>
                {favorites.map((fav) => (
                  <article key={fav.id || fav.productId} className={styles['fav-card']}>
                    <img src={fav.imageUrl || '/placeholder.jpg'} alt={fav.productName} />
                    <div className={styles['fav-info']}>
                      <h3>{fav.productName || 'Custom Piece'}</h3>
                      <p className={styles['fav-price']}>${fav.price}</p>
                      <Link to={`/product/${fav.productId}`} className={styles['fav-view-btn']}>
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My AI Designs Tab */}
        {activeTab === 'designs' && (
          <div className={styles['panel']}>
            <h2>My AI Customizations</h2>
            {designs.length === 0 ? (
              <div className={styles['empty-box']}>
                <p>No custom AI designs created yet.</p>
                <Link to="/studio" className={styles['action-link']}>Create in AI Studio</Link>
              </div>
            ) : (
              <div className={styles['designs-grid']}>
                {designs.map((design) => (
                  <article key={design.id} className={styles['design-card']}>
                    <img src={design.imageUrl || '/placeholder.jpg'} alt={design.prompt} />
                    <div className={styles['design-info']}>
                      <p className={styles['design-prompt']}>"{design.prompt}"</p>
                      {design.extraPrice > 0 && (
                        <span className={styles['design-price']}>+${design.extraPrice}</span>
                      )}
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
            <h2>Saved Addresses</h2>
            {addresses.length === 0 ? (
              <div className={styles['empty-box']}>
                <p>No addresses saved to your profile yet.</p>
              </div>
            ) : (
              <div className={styles['address-grid']}>
                {addresses.map((addr) => (
                  <div key={addr.id} className={styles['address-card']}>
                    <strong>{addr.street}</strong>
                    <p>{addr.city}, {addr.country} {addr.zipCode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings / Edit Tab */}
        {activeTab === 'settings' && (
          <div className={styles['panel']}>
            <h2>Account Settings</h2>
            <form onSubmit={handleEditSubmit} className={styles['settings-form']}>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editForm.surname}
                    onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles['form-group']}>
                <label>Username</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>Profile Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={editForm.profileImageUrl}
                  onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
                />
              </div>

              {updateError && <div className={styles['error-banner']}>{updateError}</div>}

              <button type="submit" className={styles['save-btn']} disabled={updateLoading}>
                {updateLoading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>

            <div className={styles['danger-zone']}>
              <h3>Session</h3>
              <button type="button" className={styles['logout-btn']} onClick={logout}>
                Sign Out
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
              <h2>Edit Profile</h2>
              <button type="button" className={styles['close-btn']} onClick={() => setIsEditing(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles['settings-form']}>
              <div className={styles['form-group']}>
                <label>First Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>Last Name</label>
                <input
                  type="text"
                  value={editForm.surname}
                  onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>Username</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className={styles['form-group']}>
                <label>Profile Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={editForm.profileImageUrl}
                  onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
                />
              </div>

              {updateError && <div className={styles['error-banner']}>{updateError}</div>}

              <div className={styles['modal-actions']}>
                <button type="button" className={styles['cancel-btn']} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles['save-btn']} disabled={updateLoading}>
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
