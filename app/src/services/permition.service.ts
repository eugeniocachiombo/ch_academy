import { api } from '@/services/api'

let userRole = [];
let rolePermitionList = [];

init();
async function init() {
     userRole = await api.get<unknown, any[]>('/user-roles');
     rolePermitionList = await api.get<unknown, any[]>('/role-permitions'); 
}

export function can(user_id){
    
    const roles = userRole.filter((e) => e.user_id == user_id);
    if(!roles) return false;
    
    let result = [];
    
    roles.forEach( (e, i) => {
        const response = rolePermition(e.role_id);
        if(!response[i]) return;
        result.push(response.map((e)=>e?.permition?.name)); 
    });
    
    return result;
}

 function rolePermition(role_id){
    return rolePermitionList.filter((e) => e.role_id == role_id);
}