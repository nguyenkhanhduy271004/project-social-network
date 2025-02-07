import React from 'react'

function SearchUser() {
    const handleSearchUser = () => {

    }
    return (
        <div>
            <div className='py-5 relative'>
                <input type="text" className='bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full' placeholder='Tìm kiếm...' onChange={handleSearchUser} />
            </div>
        </div>
    )
}

export default SearchUser
