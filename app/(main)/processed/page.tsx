import { getProcessedOrders } from '@/prisma/queries';
import { ProcessedOrderMenu } from './ProcessedOrderMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ProcessedOrdersPage = async () => {
  const processedOrdersData = getProcessedOrders();
  const [processedOrders] = await Promise.all([processedOrdersData]);

  return (
    <div className='relative max-h-[800px] overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Order Number</TableHead>
            <TableHead className='w-[250px]'>Consignment Number</TableHead>
            <TableHead className='w-[200px]'>Processed Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.order_number}</TableCell>
              <TableCell>{order.consignment_number}</TableCell>
              <TableCell>{order.processed_date?.toDateString()}</TableCell>
              <TableCell>
                <ProcessedOrderMenu
                  consignmentNumber={order.consignment_number}
                  labelUrl={order.label_url}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcessedOrdersPage;
