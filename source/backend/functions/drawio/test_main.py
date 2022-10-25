from main import handler


def test_diagram_with_nodes_and_edges():
    payload = {'arguments': {
        'nodes': [
            {
                'id': 'xxxxxxxxxxxx',
                'title': 'xxxxxxxxxxxx',
                'label': 'xxxxxxxxxxxx',
                'level': 0,
                'type': 'account',
                'image': '/icons/AWS-Cloud-alt_light-bg.svg',
                'hasChildren': True,
                'position': {
                    'x': 0,
                    'y': 1.25
                }
            },
            {
                'id': 'global-xxxxxxxxxxxx',
                'parent': 'xxxxxxxxxxxx',
                'title': 'global',
                'label': 'global',
                'level': 1,
                'type': 'region',
                'image': '/icons/Region_light-bg.svg',
                'hasChildren': True,
                'position': {
                    'x': 0,
                    'y': 1.25
                }
            },
            {
                'id': 'Role-global-xxxxxxxxxxxx',
                'parent': 'global-xxxxxxxxxxxx',
                'title': 'Role',
                'label': 'Role',
                'level': 2,
                'type': 'type',
                'image': '/icons/AWS-Identity-and-Access-Management-IAM_Role_light-bg.svg',
                'hasChildren': True,
                'position': {
                    'x': -56.5,
                    'y': 1.25
                }
            },
            {
                'id': 'arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM',
                'parent': 'Role-global-xxxxxxxxxxxx',
                'title': 'retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM',
                'label': 'retaildemost...',
                'level': 3,
                'type': 'resource',
                'image': '/icons/AWS-Identity-and-Access-Management-IAM_Role_light-bg.svg',
                'position': {
                    'x': -56.5,
                    'y': 1.25
                }
            },
            {
                'id': 'InlinePolicy-global-xxxxxxxxxxxx',
                'parent': 'global-xxxxxxxxxxxx',
                'title': 'InlinePolicy',
                'label': 'InlinePolicy',
                'level': 2,
                'type': 'type',
                'image': '/icons/Res_AWS-Identity-Access-Management_Permissions_48_Light.svg',
                'hasChildren': True,
                'position': {
                    'x': 56.5,
                    'y': 1.25
                }
            },
            {
                'id': 'arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM/inlinePolicy/root',
                'parent': 'InlinePolicy-global-xxxxxxxxxxxx',
                'title': 'arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM/inlinePolicy/root',
                'label': 'arn:aws:iam:...',
                'level': 3,
                'type': 'resource',
                'image': '/icons/Res_AWS-Identity-Access-Management_Permissions_48_Light.svg',
                'position': {
                    'x': 56.5,
                    'y': 1.25
                }
            }
        ],
        'edges': [
            {
                'id': 'arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM-arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM/inlinePolicy/root',
                'source': 'arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM',
                'target': 'arn:aws:iam::xxxxxxxxxxxx:role/retaildemostore-Services-1-CodePipelineServiceRole-18ZLD8A7LI3YM/inlinePolicy/root'
            }
        ]
    }}

    expected = 'https://app.diagrams.net?title=AWS%20Architecture%20Diagram.xml#R7Vr7c9pIEv5XXL4fs070gMTEy1YBwlheRlhGgGHryiUkRUhIiEICPf76%2B3okYXByqST7vKpLFZlRz0zP9NeP6Zb8c5gNduZ2xSLbCX75eRdFyS8%2Fh1nPCYILz25fCpcX784I4uXF1tw5m6Qei5a%2BYyV8LDv5d3kRmEsneE00LSva0%2BIz8nGHOMkDp325jbxNErd%2F%2B034Sfj3T78Jb6Vm1anbD2VHrP%2FHjKpTtx%2FKjlhPF6v1Ys2Qd6r%2Fq%2BlCtV4oGf77JtongbdxetFmAyHbwo27M20P0veiINq1N9HGuVklYdAWb9KVlzjjrWk57RSI3nyKNsnYK5y2KJZ9LprA%2B7dm6AV52zBXUWjexCtz67TDzCVFvDXTuPHW3UX7LTZTrWjzhZFndJ%2BtINrbz2aQ3MTJLlo75ZH%2BJcnSrdy%2F%2BeQFwckhD84u8Swz6ASeu2kn0fbG5L3A%2BYT1OLW3cYfot%2BXyhOfMbDNeOTYOf3lBjJzszA5Err%2BBE4VOsssvMHglvr9%2BC%2FPIqSsSlpcXK8dzV5gtSTINpZ6drNqXsvyensy4felWDLhVvSsNAp3Svs7szA2ipRlcfdHcyrHLi53jesCufv6%2FhX2nhZX4nZuW2PjQ73b%2BINOqmH2%2FaclH07o%2Btyzx%2FallSR9%2BwLIeo8C5%2Bpp50YTLiyQHnGX%2FtWG9AucMv2bnfe%2F6fS2y%2BAXkvqbScyafK%2FmbARSOADZfASicAlg9fR%2BA6oas%2BSEKPCv%2FKpCnE2tAz2j%2Fc8A2%2FzxUzd3mI3zzo2eGHz%2BewvlxBxt8t3MS0wtsJ4ziJNo5V2Nnd%2FAsJ74Sr3q41x%2B8rUPAVmRu4%2BL1Yqhcdz4MVXnOjko5ZfT27dvLi85sfKXaENhL8itzY191LPCNr5i5MV0nxMCV2mHPxPI5IHGvlu45mx86z2vdl%2FHLC7HnUbdDOvJDFHsJxflllCRR%2BA2KP1etGW8p6n7yMse%2B4fw7JUUon9q2mZgfefddfHDfZGHw08OdJi3ybmM5y%2FZWIXjm3aNgKdFhKNuynTdlljcPVmgdmN9JWa9V2KHlqXf2dnH3GD2MVVkbq645mG4X0kqon%2B0wCGzh%2FuAogsd6nVRVLJH%2F%2FMavaq%2FjqkommE%2BP8cJodqciS8azx2C5edzad%2BtkPmuuh5Nbfy5NCysXNTyvFtI0WcyawnASdI1pa7yUsuBJyview9n95qHXqvgd%2BW%2FUQbB%2BGN8%2FLeX7nTlrblSvK1jh7d6SFpBHaKkbzZ%2FPsuBXpb%2FXxmvvwY1cvrZcn86fHiP1ThMczAGf0Jxl8cjT1pqvCizUPXWgt9S1IA%2F9tTBUWDb05%2Fm86CRDX20MFWonYtm6xdzoN9HGzFjvR700BT1m47QYjRuiNhawlonLnpAPe42MCf1Myxvg0Zf5mmo%2B5jaZlxas15BHM5Zibq6NU2ppn3joW%2BLMUw8%2FKEcD6wvIkeP8lRxMoPOzMc5E%2Bxj9PStuV8yY7zVlHR9bfr5%2BrHmlLCxvpJqU7tlY2DPFxnwX6%2FT42FbzIU8xNNS9Ztx2mWHtNb8fH9uaJ%2BmmYDHziR7EdIYRX%2FMIvpO95qWZNm5IHM8eP6M49PsS2gzrJchQvLT1HJzDB0%2BvketGXxj6OmFdtZ167xR4xKzoYL9bH7Q9sCesm1o5Dh4LU%2FWu3%2FS8zhHvh7vuyh64riU%2FNpeDSUsNF9vlIH2vSrrEfD1f9FR3AZ8wDOLfgd4Y6biA7sHPSljYB9YNCXqt27Q6k0iya77tA98C2EJPhGkHmPYT0HKORa%2BRjsYC7E0twBcY1C3ngdaCTuZcdrbmdiaOsFfV1nvBLtMCvEQtT3P085MxAfLTWD6aARMDGA0Y9LGGvXQkjothod%2FPh6XuqC8tiRfwm%2FqwW3%2BSl%2FKSnsn2Xb4G8hawoYx5GDMmCfDOuA2W9oe%2BJVMfZxU0mqNMV1iD%2BMTHihcZ1ZjTN3PotNPUCTeyO9C0F98Dj0ZjRLKELp1RoDPBJ8B3QmeRuR1hP%2FJX4An%2FmMjgXbXVXmSDhk66K%2F3B0F%2Fa0k5IN%2BKIy6niLCr5F%2FRet7W9EV%2ByN7ZnIaM1JDd0KlDcwG%2BCvYCpbwFj2D90hzkS4VK1tVwZ4kOqkf4QQ5i41TRlXspfPP4OeyU7xU8h%2FVmNeQ6sSj3LPC5AHxrJSjGKxvyA%2Bz3Z8aiKT6XvWdwmuG3PWAI7akAPsC%2BKo4QJsDXWpKt0NEgphkqlz9%2F7fA9jHmONQP0R7BgxRCjjZ1%2BEjnA2FTGrbmt7cPk6rn8Jtkr2RlgDX5xNGJW2hRgxL35H%2FJS5PxYrn2Ia4%2FoXBK5j2DXkE7ktky0qqy63L%2FKP%2FEVvkJXirzgnXy7thc8ZKRb5gkA2OjQQt8Yc67jGeqTo5M%2FyqLxHsmU5JhO%2B%2FG6Cv%2BFMcRkz1iLfd9AnvVAsq9vKv2mOW%2Fou%2FBr4SvCvgvtCGeMzbs%2Fk%2B4Thup%2FD3iT4SN3W8tR4%2FA6b03O6F8s7aSKZwHPOfbmU78XmSW4eP2Q2nZNOJQ1xdFjq%2BMVXOd40145I%2Fi%2BPkx5sCXhmowmfU9KL0zsJ%2Bi0mkI3uoYW5RLzl%2B4cu2scZ84MIetprt5E3LKp8pPxdW4Nbwex1C%2FsuQK4ieIswiJdK5C%2BUea4p92vkKJSzaMe7tZgA5xV8CXqnXxVTIGMOHygMZU13IOUEDSb1eZxkL7Fa5rFCmZ7q4HooWW96fnqw5MXmwW23v7XO%2BnAss6TzgqAhH6sB6v6jSoF33kkN9o5eBx6Lg9OdeXHw6MTPZwXCZ8XB84OzC704RoYePzeun4clAH%2B9DP%2FsgkJpoZhIUQRMc0sKDksfRQACOow7WIbaYTEI9gsUGtPp4wDJmPcAJ6mKENmcPQomnF8rJgisq8Cc2ZFdP98ttosnu7eU3Zbqd1wUFig2OlXBcbZXhr2%2Bq6ApnaNes20scUbza2uNdXM0bpXzcvXoXPYgEBDU3oxn2mHpiePFk3awn%2B79xbhlLGaaaIWB4IzF%2B8Vguqe56K%2BWoZ7oUiuxBtkWxQ7NpXWf9KltoOBZU%2BGD4qb534qiJ7EbWKG4tWRtu5SaxVOhN56Esjg6Or2M4mqAC6y63B4GlmvO6OIK%2FKXUSCbhtFjK03wuTQ4TaerjzLwY%2B7wwg1xP3dic3e75XKx7Em6fJvmZTN25pAWWzBKD5s3sYDnD2G1LXzzdJ%2BaTVpiz1t4Sr4VRTz0JkBQY7w%2BmRJdC87AMSecairbWbjEWj7bBoO8ycAreMmztF%2FVzT8zt8pIOYA%2F7pfS4%2FpGi7%2FSy4r%2FygqcLLh8p6yYCMJK1jqD2cenRpaMwoiFJ00Wt12W4%2FHFhdCihRgKHBMVQXb2gAmOSMQrqPoK7r8sqLzpUUatphY4iuY9LBLZ1SuszunRlXDzYR0WiYiHp6RBNQBJU0eaClnNaPqJik9N0kXldhktcrmg8AWA5nZEKmPKMkEFkxdo1zvZGUluwjMv4Wu7byDXKZKsxQrIGGSXNt7BepQszBa94RIWI0ieeAtE0SuqQLDPFapI8VFygeCGeIiU6Wq9DtByJc0VjMvO4PM2R4Z7Qugqjy7XQc164UNFQqC6nKa5U0XKMcxrz11lFSzUuIy7MoqSR3KPeGRaUPGewkHMskNCNjEnjHAvS4VwusSDdr0s98qTAkjA3Ay4y8ydNSuqQVKWaR3utiRclnVT8A6sJ7UVFhUC2oSkdyKE3%2BXrIVmLEeHJMNCQmwJVoOvDXwYd4dugs0iueVPg1Nb9MIrCGn4mSNMxtVkmVXJ6Jih43pfUUO5HY0nrCu7TXgmxhzfenZF7j%2B9MLj77EXsnE6CVAMXdnXlfDmj0ldKAL0GMGW4UfwFcocfZJVkrGmcsKF%2Bdzs2oe9N3nNIzLpzRDoXlcT0eaXtBLhXl6StN4SzrSC0rqVRS9Ix6vX85hnNAq3Sgn64hnpiovvNWTvYFDQYUDKyyaSzJBf26DkS%2F0OqSDvPTVms%2BJzJSo8f3PcUCxJJW2RLx02DRwJ9%2Fl88mGKIagePcnDfJZVZnU5y8ohozGHZHbq3G6x%2BQzufXihYZ5MuyV8ILfkY%2FpnAcbdxocE%2BJV8sheyVzNgy8WpHtX4PzGFf785Uip9%2BMeJ7QXHejZa1z04oXGX2oYa%2FdkD8h9js%2BJneTAz%2Fs8dvOXgN%2F1kvGz%2B1S8DyyphbtbC3Af475sfsK9vzHv9GROL0MHvIBpqZ7We%2FQ7sIO590AJNiX7Sv1CMj0sKM8p840335h0y80%2FLOc%2B%2Beb9J%2BerV39DTl%2FlwdWXRWdjd3a7KG0vg8ha3zjBEv069b2JE3OXlOP80wtm33oBrTv%2FCNNodt83bnbRfmPzL3r%2BPtyW31lcc3sT0ZfAJG9f06e%2BFw1exNF%2BZzl%2FwTcOSOE6f0v1ceHYyPxfm%2BvOCczEO%2FCBrxlk%2BTcZ787%2BUOM%2F'

    actual = handler(payload, {})

    assert actual == expected
