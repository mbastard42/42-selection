/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   redirect.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/09 23:23:52 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/22 15:44:45 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/minishell.h"

void	open_redirect(int fd0, int fd1)
{
	if (fd0 > -1)
		dup2(fd0, 0);
	if (fd1 > -1)
		dup2(fd1, 1);
}

void	close_redirect(int fd0, int fd1)
{
	close(fd0);
	close(fd1);
}
