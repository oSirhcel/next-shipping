'use client';
import type { Order } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { processOrder } from '@/actions/process';
import Link from 'next/link';

type Props = {
    orders: Order[];
};

export const OrderList = ({ orders }: Props) => {
    return (
        <>
            <ul className='grid grid-cols-2 gap-x-4 gap-y-8'>
                {orders.map((order) => (
                    <Order key={order.orderNumber} order={order} />
                ))}
            </ul>
        </>
    );
};

const Order = ({ key, order }: { key: string; order: Order }) => {
    const [pending, startTransition] = useTransition();
    const [consignmentLink, setConsignmentLink] = useState<string | null>('');

    const handleProcessClick = (order: Order) => {
        if (pending) return;
        startTransition(() => {
            processOrder(order)
                .then((data) => {
                    toast.success(
                        `Order ${order.orderNumber} processed successfully`,
                    );
                    setConsignmentLink(data);
                })
                .catch((error: Error) => {
                    toast.error(`Failed to process ${order.orderNumber}`, {
                        description: error.message,
                        action: {
                            label: 'Retry',
                            onClick: () => {
                                handleProcessClick(order);
                            },
                        },
                        actionButtonStyle: {
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                        },
                    });
                });
        });
    };

    return (
        <div
            key={key}
            className='rounded-lg border-2 border-slate-200 shadow-lg'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[150px]'>
                            {order.orderNumber}
                        </TableHead>
                        <TableHead>Length</TableHead>
                        <TableHead>Width</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead className='text-right'>Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.orderRows.map((orderRow, index) => (
                        <TableRow key={index}>
                            <TableCell className='font-medium'>
                                {order['Carton/Pallet']}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Length}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Width}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Height}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Quantity}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4} className='font-bold'>
                            Total Weight
                        </TableCell>
                        <TableCell className='text-right font-bold'>
                            {order.totalWeight}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className='flex items-end justify-end gap-4 p-2'>
                {consignmentLink && (
                    <Link href={consignmentLink}>
                        <Button variant='link'>Download Consignment</Button>
                    </Link>
                )}
                <Button
                    onClick={() => {
                        handleProcessClick(order);
                    }}
                >
                    {pending ? 'Processing...' : 'Process Order'}
                </Button>
            </div>
        </div>
    );
};