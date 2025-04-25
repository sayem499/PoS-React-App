import React, {useState} from 'react'
import '../css/settings.css';
import Currency from '../components/settings/currency';
import Account from '../components/settings/account';
import Payment from '../components/settings/payment';

const  Settings = () => {
  const settingTabs = ['Account','Payment', 'Currency']
  const [selectedTab, setSelectedTab] = useState('Account');



  return (
    <div className='settings-container'>
      <div className='settings-wrapper'>
        <div className='settings-top-bar'>
          <div className='settings-title'>
            <span><h3>Settings</h3></span>
          </div>

          <div className='settings-tabs'>
              <ul className='settings-tab-list-container'>
                {
                  settingTabs.map((tab) => (
                    <li className={`${selectedTab === tab ? 'settings-tab-list-selected' : 'settings-tab-list'}`}
                        onClick={() => setSelectedTab(tab)}
                    >{tab}</li>
                  ))
                }
              </ul>
          </div>
        </div>

        <div className='settings-content'>
          {selectedTab === 'Account' && <Account />}
          {selectedTab === 'Payment' && <Payment />}
          {selectedTab === 'Currency' && <Currency />}
      </div>
      </div>
    </div>
  )
}

export default Settings