import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, User, Phone, Mail, Search, Filter } from 'lucide-react';

export default function ContactTodoApp() {
  const [contacts, setContacts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 15) {
      newErrors.name = 'Name must be 15 characters or less';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Notes validation
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    } else {
      const wordCount = formData.notes.length;
      if (wordCount > 50) {
        newErrors.notes = 'Notes must be 50 words or less';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {
      const newContact = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toLocaleDateString()
      };
      setContacts([...contacts, newContact]);
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setErrors({});
      setShowAddForm(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      notes: contact.notes
    });
  };

  const handleUpdate = () => {
    if (validateForm()) {
      setContacts(contacts.map(contact => 
        contact.id === editingId 
          ? { ...contact, ...formData }
          : contact
      ));
      setEditingId(null);
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setErrors({});
    }
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: '', phone: '', email: '', notes: '' });
    setErrors({});
  };

  const filteredContacts = contacts.filter(contact => {
    const nameMatch = searchFilters.name === '' || 
      contact.name.toLowerCase().includes(searchFilters.name.toLowerCase());
    
    const phoneMatch = searchFilters.phone === '' || 
      contact.phone.includes(searchFilters.phone);
    
    const emailMatch = searchFilters.email === '' || 
      contact.email.toLowerCase().includes(searchFilters.email.toLowerCase());
    
    return nameMatch && phoneMatch && emailMatch;
  });

  const hasActiveFilters = searchFilters.name || searchFilters.phone || searchFilters.email;

  const clearAllFilters = () => {
    setSearchFilters({ name: '', phone: '', email: '' });
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600" />
            Contact Manager
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-blue-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editingId ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength="15"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name (max 15 chars)"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                <p className="text-gray-400 text-xs mt-1">{formData.name.length}/15 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength="10"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                <p className="text-gray-400 text-xs mt-1">{formData.phone.length}/10 digits</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter valid email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes *
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="50"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.notes ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter notes (max 50 words)"
                />
                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  {formData.notes.length ? formData.notes.length : 0}/50 words
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Save size={16} />
                {editingId ? 'Update' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Search size={20} />
            Search Contacts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchFilters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name..."
                />
              </div>
              {searchFilters.name && (
                <button
                  onClick={() => handleFilterChange('name', '')}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Clear name filter
                </button>
              )}
            </div>

            {/* Phone Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={searchFilters.phone}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter phone..."
                />
              </div>
              {searchFilters.phone && (
                <button
                  onClick={() => handleFilterChange('phone', '')}
                  className="text-xs text-green-600 hover:text-green-800 mt-1"
                >
                  Clear phone filter
                </button>
              )}
            </div>

            {/* Email Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={searchFilters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter email..."
                />
              </div>
              {searchFilters.email && (
                <button
                  onClick={() => handleFilterChange('email', '')}
                  className="text-xs text-purple-600 hover:text-purple-800 mt-1"
                >
                  Clear email filter
                </button>
              )}
            </div>
          </div>

          {/* Filter Summary and Clear All */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-white rounded-md border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Active Filters:</span>
                  {searchFilters.name && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Name: "{searchFilters.name}"</span>}
                  {searchFilters.phone && <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Phone: "{searchFilters.phone}"</span>}
                  {searchFilters.email && <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Email: "{searchFilters.email}"</span>}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Found {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} matching your criteria
              </div>
            </div>
          )}
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.length === 0 && contacts.length === 0 ? (
            <div className="text-center py-12">
              <User size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No contacts yet</p>
              <p className="text-gray-400">Add your first contact to get started</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No contacts found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
              <button
                onClick={clearAllFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {contact.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-green-600" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-blue-600" />
                          {contact.email}
                        </div>
                      )}
                    </div>
                    {contact.notes && (
                      <p className="text-gray-600 mt-2 text-sm">
                        <strong>Notes:</strong> {contact.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Added: {contact.createdAt}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition-colors"
                      title="Edit contact"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {contacts.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <p className="text-blue-800 font-medium">
                Total Contacts: {contacts.length}
              </p>
              {hasActiveFilters && (
                <p className="text-blue-600 text-sm">
                  Showing: {filteredContacts.length} of {contacts.length} contacts
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}