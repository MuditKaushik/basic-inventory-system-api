import { IInventoryQueryService, InventoryQueryService } from '../inventory-services/inventory-query-service';
import { IAccountQueryService, AccountQueryService } from '../account-services/account-query-service';
import { IInventoryCommandService, InventoryCommandService } from '../inventory-services/inventory-command-service';
export class HandlerManagers {
    get inventoryQueryManager(): IInventoryQueryService {
        return new InventoryQueryService();
    }
    get inventoryCommandManager(): IInventoryCommandService {
        return new InventoryCommandService();
    }
    get accountQueryManager(): IAccountQueryService {
        return new AccountQueryService();
    }
}
