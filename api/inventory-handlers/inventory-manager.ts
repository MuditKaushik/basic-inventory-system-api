import { IInventoryQueryService, InventoryQueryService } from '../inventory-services/inventory-query-service';
export class InventoryManager {
    get queryManager(): IInventoryQueryService {
        return new InventoryQueryService();
    }
}
