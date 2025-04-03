/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/08 20:27:13 by mbastard          #+#    #+#             */
/*   Updated: 2022/06/29 17:33:01 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

static int	check_if_unbr(char *arg);
static int	check_if_ulong(char *arg);

int	check_args(int argc, char **argv)
{
	int		i;
	int		error;

	i = 0;
	error = 0;
	if (argc < 5 || argc > 6)
	{
		printf("Error\nNumber of arguments: 4 or 5\n");
		return (0);
	}
	while (++i < argc)
	{
		if (!(check_if_unbr(argv[i]) && check_if_ulong(argv[i])))
		{
			if (!error++)
				printf("Error\n");
			printf("Argument %c range: [0 - 4294967295]\n", i + 48);
		}
	}
	if (error)
		return (0);
	return (1);
}

static int	check_if_unbr(char *arg)
{
	int	i;

	i = 0;
	if (arg)
	{
		if (!ft_strchr("+0123456789", arg[i], 0))
			return (0);
		if (arg[i] == '+' && !arg[i + 1])
			return (0);
		while (arg[++i])
			if (!ft_strchr("0123456789", arg[i], 0))
				return (0);
		return (1);
	}
	return (0);
}

static int	check_if_ulong(char *arg)
{
	int	i;

	i = 0;
	if (arg[i] == '+')
		i++;
	while (arg[i] == '0')
		i++;
	if (ft_sublen(&arg[i], 0) > 10)
		return (0);
	if (arg[i] > '4' && ft_sublen(&arg[i], 0) == 10)
		return (0);
	if (arg[i] == '4' && ft_atoi(&arg[i + 1]) > 294967295)
		return (0);
	return (1);
}
