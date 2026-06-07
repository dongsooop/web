import type { SocialState } from './types/backend';
import type { LoginPlatform, SocialConnectItem } from './types/ui-model';
import { formatYmdDot } from '@/utils/formatter/date';

const socialOrder: LoginPlatform[] = ['kakao', 'google'];

export function providerKey(platform: LoginPlatform) {
  switch (platform) {
    case 'kakao':
      return 'KAKAO';
    case 'google':
      return 'GOOGLE';
  }
}

export function buildSocialConnectItems(list: SocialState[]): SocialConnectItem[] {
  return socialOrder.map((platform) => {
    const found = list.find(
      (item) => item.providerType.trim().toUpperCase() === providerKey(platform),
    );

    return {
      platform,
      isConnected: !!found,
      date: found ? formatYmdDot(found.createdAt) : null,
    };
  });
}
