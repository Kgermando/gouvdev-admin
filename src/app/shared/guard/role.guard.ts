import { CanActivateFn } from '@angular/router'; 
 
export const dashboardGuard: CanActivateFn = (route, state) =>  {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  console.log("permissionList", permissionList)
  let access = false; 
  if (permissionList.includes('Dashboard')) { 
    access = true;
  }  
  return access; 
};

export const ActualitesGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Actualites')) { 
    access = true;
  }
  return access; 
};

export const ContactGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Contact')) { 
    access = true;
  }    
  return access; 
};

export const PersonnalitesGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Personnalites')) { 
    access = true;
  }    
  return access; 
};

export const PropositionsLoisGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('PropositionsLois')) { 
    access = true;
  }    
  return access; 
};

export const SondagesGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Sondages')) { 
    access = true;
  }     
  return access;  
};
export const TeamsGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Teams')) { 
    access = true;
  }     
  return access;  
};
export const TextesGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Textes')) { 
    access = true;
  }     
  return access;  
};
export const UsersGuard: CanActivateFn = (route, state) => {
  let permissions = localStorage.getItem('permissions');
  let permissionList = JSON.parse(permissions!) 
  let access = false; 
  if (permissionList.includes('Users')) { 
    access = true;
  }     
  return access;  
}; 