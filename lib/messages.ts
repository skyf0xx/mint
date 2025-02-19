import { message } from '@permaweb/aoconnect';
import { createUnsecureSigner } from './signer';

const unsecureSigner = {
    d: 'HiYlLTsbzCz43nbesLQaTVmBuI_zVRJ9BYpze122VpZr5Wegc7oKTh-omhtheTbAzOCsGcUMFIGSBacrovvZVrar9Lw3UOE_PAUBf9L6dRi5XXxel7Thv6gTMXpCAEPyGh1-bRbaZVE8nObilF9ws6A7cVp4fBQkP2WnVwG3YdchcN0peP1NsPrUPzbqa6yB3XHkrfB8Voe-ot2GRMFcXn1raWBoAIT1pZ1VYRdoeHnSjgETSvS_qummhwllXu0R7Rh0eBX8_XQSqBu561f8ZUXikUaR2EbMJoQZWypMbJ7dqakURLc6U2x6xAl30fRf2tNmTORY9GsWGs499MbDtClL3CLX32fb4XsGxvEvRKwH-I01PJ08kUX0p8a-lT8Y_WW8kOtUVRe9rjpK3PW0EK9ELD0BjMH-OkjSsIaYywcdaIQzgsv7cP-oT-bbfh3qR-08O2n_SASSSbScnMizxhqKYXmOfXPJD77RrHLKT2kKqK7gtloEO0bOhpUnTTzdEWK35E5Ph3H_aWDBKKvvw1p5kpEAf3IKqEqMczzV3zc2G2eqLxPIpkFI7sZISMejY0q8N1rHjCL7X0OWEF3ViziLNuUQqf--LgPRgmWh6zSBNXH1cV1hk1ksnINfVAymgEB8BJJlx3xebQ1P-op2kKsRUqNwyQRkt0FnimnojAE',
    dp: 'SgFEGaR_El9h0Lu-4scSEGLjpTcyP-T9gbWsbRaKOeM3u41FQN9cTswJcYahNgp4Cmu3IdF0c20WhzV0oM9_i2gMnEwK5_hDvLIAAdCRvyfISFzEWVZ1BYiuRq4OrmjKN7dSJVxUfh7Zv08os9ZqyiSzegBP1Lsc9xw7GLnYFzB0mqs0t32M9x8O6DiuXGDXqi-xtSJyjN9w8Bchndb0uVUChsLKNWRWP5FQgBzJ1q7RkT9Gicfo1yyB2ys7pQoSP_pi0PkFzCYQkfiSTz0CZ3h9JZUx3QDXWsPTyClu2yRNKwMbn9PtrWNmJIVJI_82xhhsND5uD5jTCICxFu00AQ',
    dq: 'gQqQfn0dNEdsG94j24cQbYw-BUhqY07a9WkVIWnm0nKYkxIcIRDVO3iq8cTtKCSS24MPWaSAPjhoLd6q4rujw2dWZLRlWfdAH4T-hG15X7ZZ4Uk_1ZZctZaBEwkgPje3effP-VXjDaMMGOab_bxnXYKio-q37zi_IRSc3ZJ8RhFoKtuN4Sr9R2pSp--IfrbHMEbStIlVWQ0FdZxXLMMW08zoTbYedg3sdE44Bedl0vyxV_a0fWx8LlUqe7TA1HDybqz5Ijs7rfxVjCdi4fQ4VdkjpVRZdN9cDKxC9p-TjGBxVbUnfcmjDZqwzHvqakCFDOWESXYrCDTKy44LiXcZXw',
    e: 'AQAB',
    ext: true,
    kty: 'RSA',
    n: 'lyoxddnAGT2x1-xb4tVX3mNHi-5K9BuyDQiULdpj7icuHr1ZKM5QB2cNfV2NC7JnNR_sdmVy-g8NSII6hiZGrMg259rJ8kMaA7nV_HHf67GM16EhUO-YraPjH1hq6DPoibdZVxT3P6os-H0t6cBeYhAAqGSgVhwDcB_IJ9FvBUdL0JN79WZiy0RRb8vbTwF_wRZPZUxyb_2YIZyRXi279SVE26pmXwH7O3_4cskX_WGdK0G79g0sbrjf6b_itOYa8-JW2hx_h2AHciui_ZbSVQGBRDLnl_mpp4SwLOIBvdOqEeBZRBafM9GqL-kLDe3SMZ1Z4gIIq_XJZNoJ-CQL5Joe03HYLBpgxoO16Lgcc_eVi8CMigfsw388DCfcD3X43qhEUA3VcoDSkflRIDhJNxA7-aHb09likUBepsIziT4CEmglW-Ydb4fp-y1jUbuvzvhMhNfR11ySTN-0L8mtnvP23V5Jn8dDm45WIY9KJg-u39G8LNJKTttl6BvgaA9yfAnNV9G_V-YeiHhhHw_Uab6WTI-8k-VIE6QTl8XZufqKKV8I7YYVplkQTL2DEacdplidmVFwBlmLPGbo_jwi8x0L4GnRUu9Rk_qrziNUdSOsCCwyIdGf0RSUew3LHAjjk9XwUIbs6FBcfms3DgmR2T86MwmDMa3dEmUOTDNjEtc',
    p: '8RSqpxx8yqmzs-zBTFlW9IjEk3ERHb2_FhsBBxZcl4v4JVJ-Qi1q5DANaBC63H5PAfTfaxMxTrxnlaubMlDiVkUSM3fIQ9a3dGd87lHXU-BvXtBkc64H1qPlA9jgHgYqthZ4b_W96ZiE7TQ_qam1Ijk7W6RnY_qgT7lhGnRQ8ZOuzcj4OKEac3DYUISgZf4rDHzbCCvfHDLFIOhT8imeH6F6O5HDe4pdwYpfJlGD5lrb8DtYp77hunz4yyePNbIQQ1kvtdZMKS0UsPEdi3tgVXJNmPU6SFzlgG9Zm9hJJnGpt16hcLYwbB_oe7rZNI72KuXxc3_dKNUzjYXpclMOAQ',
    q: 'oIUHgK5Il25YsaiQiUXtN8LU-vkVfYVH2jJXsuk6CJaHeB1YSkVKsLHVjaVkgVtXPDpNpEAXLmcDoY21a4xdxn5QupAZzaw17f9qxnQ6Wnv2aokjWBTO1y9TX-AQDRmP49pSj6cerEiaV9r6babSb6RW2onP6hRGE56iPEdIIrOwgcZOmBVVXvV2Be3RyCB8vMZclOHM4my1pQ6EkgkkjKO7TjVw3MdK025YnsqhrDtwDuNvjN1AOe04A8RVT8UuLIQRjA4A3u8hxJ30MvAn7qGSPuLTOsi7im5222sv4EylQfRakWELZoonrNXuALlDXj6Pt2_X9BC12PJnn0JQ1w',
    qi: 'jO0p8SilxKO9ce9fYLepd-Z0we3SWAk8PVy3Mzd_dz8fdDH_Gfq_7fJzwaeE6bZl7kk4pNncXBbV3qJn5Awux9376CW516CqK2UPImrv1k36jXzwVXDKQ1nXViPIjsrRaCDopCRJhjmvYHRKIszoG0Tver1vEX-HECry-QRei-8eJ1biYQN9lNupTZGkd18xZOT-tqZHP1c3GE3e_zgPvdD97mS55lQzJ0SJ5qPo2HWr8-78onSimpaSPZyu4AhFB4HpGjwG3CzBV3yeO1lo9h86bOnRk7-hI2DN63PrkRMNAJdq0ZFjCd1vablmeUC0noaBVKa5gz8aUcBCfdX5ow',
};

export const sendMessage = async (
    process: string,
    tags: { name: string; value: string }[],
    signer = false,
    data = ''
): Promise<string> => {
    try {
        return await message({
            process,
            tags,
            signer:
                (signer as never) ||
                (createUnsecureSigner(unsecureSigner) as never),
            data,
        });
    } catch (error) {
        console.error('Error sending message:', error, {
            tags,
            data,
        });
        throw error;
    }
};
