'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import SubscriptionStatusBadge from '~/app/(app)/components/SubscriptionStatusBadge';

import DataTable from '~/core/ui/DataTable';
import UserData from '~/core/session/types/user-data';
import { Avatar, AvatarFallback, AvatarImage } from '~/core/ui/Avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';

import IconButton from '~/core/ui/IconButton';
import Badge from '~/core/ui/Badge';
import If from '~/core/ui/If';
import Subscription from '~/lib/subscriptions/subscription';
import configuration from '~/configuration';

const EMPTY_ROW = <span>-</span>;

type UserRow = {
  id: string;
  email: string | undefined;
  phone: string | undefined;
  createdAt: string;
  updatedAt: string | undefined;
  lastSignInAt: string | undefined;
  banDuration: string | undefined;

  data: Maybe<
    UserData & {
      subscription: Maybe<{
        customerId?: string | undefined;
        data: Subscription;
      }>;
    }
  >;
};

const columns: Array<ColumnDef<UserRow>> = [
  {
    header: '',
    id: 'avatar',
    size: 10,
    cell: ({ row }) => {
      const user = row.original;
      const data = user.data;
      const displayName = data?.displayName;
      const photoUrl = data?.photoUrl;
      const displayText = displayName ?? user.email ?? user.phone ?? '';

      return (
        <Tooltip>
          <TooltipTrigger>
            <Avatar>
              {photoUrl ? <AvatarImage src={photoUrl} /> : null}
              <AvatarFallback>{displayText[0]}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>

          <TooltipContent>{displayText}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    header: 'ID',
    id: 'id',
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <Link className={'hover:underline'} href={`/admin/users/${id}`}>
          {id}
        </Link>
      );
    },
  },
  {
    header: 'Email',
    id: 'email',
    cell: ({ row }) => {
      const email = row.original.email;

      return (
        <span title={email} className={'truncate max-w-full block'}>
          {email}
        </span>
      );
    },
  },
  {
    header: 'Name',
    size: 50,
    id: 'displayName',
    cell: ({ row }) => {
      return row.original.data?.displayName ?? '';
    },
  },
  {
    header: 'Created at',
    id: 'createdAt',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const locale = configuration.site.locale ?? 'en-US';

      return <span>{date.toLocaleDateString(locale)}</span>;
    },
  },
  {
    header: 'Last sign in',
    id: 'lastSignInAt',
    cell: ({ row }) => {
      const lastSignInAt = row.original.lastSignInAt;

      if (!lastSignInAt) {
        return EMPTY_ROW;
      }

      const date = new Date(lastSignInAt);

      return <span suppressHydrationWarning>{date.toLocaleString()}</span>;
    },
  },
  {
    header: 'Status',
    id: 'user-status',
    cell: ({ row }) => {
      const banDuration = row.original.banDuration;

      if (!banDuration || banDuration === 'none') {
        return (
          <Badge size={'small'} className={'inline-flex'} color={'success'}>
            Active
          </Badge>
        );
      }

      return (
        <Badge size={'small'} className={'inline-flex'} color={'error'}>
          Banned
        </Badge>
      );
    },
  },
  {
    header: 'Subscription',
    id: 'subscription',
    cell: ({ row }) => {
      const priceId = row.original?.data?.subscription?.data?.priceId;

      if (!priceId) {
        return EMPTY_ROW;
      }

      const plan = configuration.stripe.products.find((product) => {
        return product.plans.some((plan) => plan.stripePriceId === priceId);
      });

      if (plan) {
        const price = plan.plans.find((plan) => plan.stripePriceId === priceId);

        if (!price) {
          return 'Unknown Price';
        }

        return `${plan.name} - ${price.name}`;
      }

      return EMPTY_ROW;
    },
  },
  {
    header: 'Subscription Status',
    id: 'subscription-status',
    cell: ({ row }) => {
      const subscription = row.original?.data?.subscription;
      const data = subscription ? subscription.data : undefined;

      if (!data) {
        return EMPTY_ROW;
      }

      return <SubscriptionStatusBadge subscription={data} />;
    },
  },
  {
    header: 'Subscription Period',
    id: 'subscription-period',
    cell: ({ row }) => {
      const subscription = row.original?.data?.subscription?.data;

      if (!subscription) {
        return '-';
      }

      const canceled = subscription.cancelAtPeriodEnd;
      const date = subscription.periodEndsAt;
      const locale = configuration.site.locale ?? 'en-US';
      const formattedDate = new Date(date).toLocaleDateString(locale);

      return canceled ? (
        <span className={'text-orange-500'}>Stops on {formattedDate}</span>
      ) : (
        <span className={'text-green-500'}>Renews on {formattedDate}</span>
      );
    },
  },
  {
    header: '',
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      const banDuration = row.original.banDuration;
      const isBanned = banDuration && banDuration !== 'none';

      return (
        <div className={'flex justify-end'}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton>
                <span className="sr-only">Open menu</span>
                <EllipsisHorizontalIcon className="h-4 w-4" />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>

              <If condition={!isBanned}>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/impersonate`}>
                    Impersonate User
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    className={'text-orange-500'}
                    href={`/admin/users/${user.id}/ban`}
                  >
                    Ban User
                  </Link>
                </DropdownMenuItem>
              </If>

              <If condition={isBanned}>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/reactivate`}>
                    Reactivate User
                  </Link>
                </DropdownMenuItem>
              </If>

              <DropdownMenuItem asChild>
                <Link
                  className={'text-red-500'}
                  href={`/admin/users/${user.id}/delete`}
                >
                  Delete User
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

function UsersTable({
  users,
  page,
  pageCount,
  perPage,
}: React.PropsWithChildren<{
  users: UserRow[];
  pageCount: number;
  page: number;
  perPage: number;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DataTable
      tableProps={{
        'data-cy': 'admin-users-table',
      }}
      onPaginationChange={({ pageIndex }) => {
        router.push(`${pathname}?page=${pageIndex + 1}`);
      }}
      pageIndex={page - 1}
      pageSize={perPage}
      pageCount={pageCount}
      data={users}
      columns={columns}
    />
  );
}

export default UsersTable;
