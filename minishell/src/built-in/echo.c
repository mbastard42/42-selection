/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   echo.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/14 18:07:58 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/19 01:42:14 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

static void	print_echo(char **argv, int flag)
{
	size_t	i;

	i = 0;
	while (argv[++i])
	{
		printf("%s", argv[i]);
		if (argv[i + 1])
			printf(" ");
	}
	if (!flag)
		printf("\n");
}

int	check_option(char **cmd)
{
	int	i;
	int	j;
	int	options;

	i = 0;
	options = 0;
	while (cmd[++i] && cmd[i][0] == '-')
	{
		j = 0;
		while (cmd[i][++j])
		{
			if (cmd[i][j] != 'n' && cmd[i][j])
				return (options);
		}
		if (j > 1)
			options++;
	}
	return (options);
}

int	echo(char **argv)
{
	if (check_option(argv))
		print_echo(&argv[check_option(argv)], 1);
	else
		print_echo(argv, 0);
	return (0);
}
